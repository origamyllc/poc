/**
 * Copied by lcranford on 2/25/14.
 */
 var Promise = require('bluebird'),
    Errors = require('./../errors'),
    CacheManager = require('cache-manager'),
    config = require('./../config/config'),
    solrClient = require('solr-client').createClient(config.solr.host, config.solr.port, '', config.solr.path),
    _ = require('lodash'),
    HTTP = require('q-io/http'),
    async = require('async'),
    flowUrl = 'flow.tbs.io',
    ttl = 60 * 60 * 24, // 1 day
    cache = CacheManager.caching({store: 'memory', max: 200, ttl: ttl}),
    logger = require('../logger');

    function deferredAction(action) {

      var deferred = Promise.defer();

      var actionResolver = {
        reject: function(err) {
          deferred.reject(err);
        },
        resolve: function(resolvedVal) {
          deferred.resolve(resolvedVal);
        }
      };

      action(actionResolver);

      return deferred.promise;
    }


    exports.ping = function() {

      return deferredAction(function(cb) {
        solrClient.ping(function(err, obj) {
          if(err) {
            cb.reject(err);
          }

          cb.resolve(obj);
        });
      });
    };

    exports.getTitleTypes = function() {

      return deferredAction(function(cb) {

        //TODO: Add caching...
        var query = solrClient.createQuery()
        .q({ 'Type': 'T' })
        .start(0)
        .rows(40)
        .fl(['TypeId', 'TypeName'])
        .group({ on: true, field: 'TypeId', main: true })
        .sort({ 'TypeId': 'asc' });

        solrClient.search(query, function(err, obj) {

         if(err) {
           cb.reject(err);
         }

         cb.resolve(obj.response.docs);
       });
      });
    };

/**
 *
 * @param options.term - Term or Title name to search
 * @param options.pageIndex - Zero index of page (default 0)
 * @param options.pageSize - Size of page (default 20)
 * @param options.fields - Fields to return (default [Id, Name, TypeName, ReleaseYear])
 * @returns An array of Title docs
 */
 exports.searchTitles = function(options) {

  var defaults = {
    pageIndex: 0,
    pageSize: 20,
    fields: ['Id', 'Name', 'TypeName', 'ReleaseYear', 'SeriesName', 'ProductionNumber', 'AllNames']
  }, searchTerms = 'Type:T AND "'+ options.term +'"';

  return deferredAction(function(cb) {

    _.defaults(options, defaults);


    logger.info({ searchTerm: options.term}, 'searching titles');

    if (options.qPositionNormalized) {
      logger.debug({ qPositionNormalized: options.qPositionNormalized });
    }

    var queryFields = {
      'Id_ALT': 200,
      'AllNames': 50,
      'Name_ALT': 100
    };

    var query = solrClient.createQuery()
    .q(searchTerms)
    .qf(queryFields)
    .qs(50)
    .mm(100)
    .pf({'AllNames_ALT':100})
    .ps(50)
    .defType('edismax')
    .matchFilter('+Type','T')
    .start(options.pageIndex)
    .rows(options.pageSize)
    .fl(options.fields);

    if (options.groupResults) {
      query.facet({
        field: ['TypeName', 'SeriesName', 'OriginalNetwork', 'Genres', 'PerformanceMode', 'AnimationMode', 'Properties', 'FlaggedForReview', 'ReleaseYear'],
        mincount: 1
      });
    }

    if (options.yearStart) {
      query.rangeFilter({ field : 'ReleaseYear', start : options.yearStart, end : options.yearEnd || (new Date()).getFullYear() + 20 });
    }

    if (options.typeNames) {
      for (var i = 0; i < options.typeNames.length; i++) {
        query.matchFilter('TypeName','"'+options.typeNames[i]+'"');
      }
    }

    solrClient.search(query, function(err, obj) {
      if(err) {
        logger.error(err);
        err.options = options;
        cb.reject(err);
      }
      else {
        obj.response.term = options.term;
        obj.response.qPositionNormalized = options.qPositionNormalized;
        cb.resolve(obj.response);
      }
    });
  });
};

exports.getByIds = function(titleIds) {
  if(_.isArray(titleIds)) {

    if (titleIds.length > 24)
    {
      //make chuncks of 24.
      var lists = _.chain(titleIds).groupBy(function(element, index){
        return Math.floor(index/24);
      }).toArray()
      .value();

      //make async tasks.
      var asyncTasks = [];
      _.each(lists, function(list){
        asyncTasks.push(function(cb1){
          var url = 'http://' + flowUrl + '/title/' + list;
          logger.info({ flowUrl: url });

          HTTP.read(url).then(function(data){
            cb1(null, JSON.parse(data));//1st param (null) is the error.
          });
        });
      });

      return deferredAction(function(cb) {
        async.parallel(asyncTasks, function(err, data){
          // All tasks are done now, data is an array of titles arrays.
          data = _.flatten(data, true);//flatten to a single level.
          cb.resolve(data);
        });
      });
    }

    titleIds = titleIds.join(',');
  }

  var url = 'http://' + flowUrl + '/title/' + titleIds;
  logger.info({ flowUrl: url });

  return HTTP.read(url).then(JSON.parse);
};


exports.getNetworks = function(options) {
  var defaults = {
    turnerNetworksOnly: true
  },  url = 'http://' + flowUrl + '/networks';

  _.defaults(options, defaults);

  if(options.turnerNetworksOnly) {
    url += '/turner';
  }

  logger.info({ flowUrl: url });

  return HTTP.read(url).then(JSON.parse);
};
