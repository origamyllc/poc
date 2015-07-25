/**
 * Created by lcranford on 3/04/14.
 */
'use strict';


var buildInfo = require('../../etc/buildInfo.json');

exports.getBuildInfo = function(req, res) {

   return res.json(200, buildInfo);	
};