'use strict';

module.exports = function(mongoose) {

  var Device = mongoose.model('Device'),
    _ = require('lodash'),
    controller = {};



  function sender(res) {
    return function(err, result) {
      if (!err) {
        return res.json(result);
      }
      res.log.error(err, 'devices sender');
      return res.json(500, err);
    };
  }
  
  controller.create = function(req, res) {
    var device;

     req.log.info({ postedBody: req.body });
     device = new Device(req.body.device);
     device.save(sender(res));
  };

controller.limitedDevices = function(req, res) {
      return Device.find({},sender(res));
  };

  controller.show = function(req, res) {
    console.log({},sender(res));
    return Device.find({},sender(res));
  };

controller.deleteDevices = function(req, res) {
    console.log({},sender(res));
        Device.findById(req.params.deviceId, function (err, device ) {
              device.remove(sender(res));
       });
  };

  
  controller.getDevicebyId = function(req, res) {
    console.log({},sender(res));
        Device.findById( req.params.deviceId, function (err, device ) {
        
      if (err) {
        req.log.info(err, 'Error loading contract');
        return res.json(500, err);
      }

       return res.json(200, device);

       });
  };

   controller.getDevices = function(req, res) {
    console.log("{},sender(res)");
    console.log({},sender(res));
    return Device.find({},sender(res));
  };

  controller.update=function(req, res){
     Device.findById( req.params.deviceId, function (err, device ) {
        console.log(device);
        console.log(req.body);
        
      if (err) {
        req.log.info(err, 'Error loading Device');
        return res.json(500, err);
      }

       /**

  device.sensors = sensors;
  doc.save();

        */
       return res.json(200, device);

       });
  }

  return controller;
};
