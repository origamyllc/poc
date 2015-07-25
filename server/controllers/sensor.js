'use strict';

module.exports = function(mongoose) {

  var Sensor = mongoose.model('Sensor'),
    _ = require('lodash'),
    controller = {};



  function sender(res) {
    return function(err, result) {
      if (!err) {
        return res.json(result);
      }
      res.log.error(err, 'sensor sender');
      return res.json(500, err);
    };
  }
  
  controller.create = function(req, res) {
    var sensor;

     req.log.info({ postedBody: req.body });
     sensor = new Sensor(req.body.sensor);
     sensor.save(sender(res));
  };


  controller.show = function(req, res) {
    console.log({},sender(res));
    return Sensor.find({},sender(res));
  };

   controller.getSensors = function(req, res) {
    console.log("{},sender(res)");
    console.log({},sender(res));
    return Sensor.find({},sender(res));
  };

  controller.getSensorsByDevice=function(req, res) {
    console.log(req.params.deviceId);
    return Sensor.find({deviceId:req.params.deviceId },sender(res));
  };

 controller.getSensorById=function(req, res) {
     console.log( Sensor.findOne( {'_id' :req.params.sensorId } ));
     return Sensor.findOne( {'_id' :req.params.sensorId },sender(res));
 }

 controller.deleteSensorById=function(req, res) {
 console.log({},sender(res));
        Sensor.findById(req.params.sensorId, function (err, sensor ) {
              sensor.remove(sender(res));
       });
 }
 

  return controller;
};

