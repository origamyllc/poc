'use strict';

angular.module('thingyApp')
.filter('typeaheadMatch', function() {

  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
  
  return function(matchItem, query) {
    // return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<em>$&</em>') : matchItem;
    if (query) {
      if (matchItem.search(new RegExp(escapeRegexp(query), 'gi')) === -1) {
        return '&nbsp;<span class="badge"><i class="glyphicon glyphicon-film"></i></span>';
      }
    }
    return ;
  };
});