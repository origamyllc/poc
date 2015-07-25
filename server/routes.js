'use strict';

var mongoose = require('mongoose'),
    device = require('./controllers/devices')(mongoose),
    sensors = require('./controllers/sensor')(mongoose),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session= require('./controllers/session'),
    _ = require('lodash'),
    currentSensorController = require('./controllers/currentSensor'),
    relayController = require('./controllers/relay'),
    buildInfoController = require('./controllers/buildInfo');

    //services
    var messengerService=require('./services/messagingService');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {
  
  app.get('/api/v1/devices', device.limitedDevices);
  app.post('/api/v1/devices', device.create);

  app.get('/api/v1/devices/:deviceId', device.show);
  app.get('/api/v1/devices/getall', device.getDevices);
  app.get('/api/v1/devices/delete/:deviceId', device.deleteDevices);
  app.get('/api/v1/devices/get/:deviceId',device.getDevicebyId);
  

  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/v1/sensors', sensors.create);
  app.get('/api/v1/sensors/:id', sensors.show);
  app.get('/api/v1/sensors/getall', sensors.getSensors);
  app.get('/api/v1/sensors/:deviceId/get', sensors.getSensorsByDevice);
  app.get('/api/v1/sensors/:sensorId/get/sensor',sensors.getSensorById);
  app.get('/api/v1/sensors/:sensorId/delete/sensor',sensors.deleteSensorById);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  app.get('/api/v1/buildinfo', buildInfoController.getBuildInfo);

   app.get('/api/v1/relay/:action', relayController.toggleSwitch);
   app.get('/api/v1/current', currentSensorController.measureCurrent);

   //app.get('/api/v1/messenger', messengerService.connect);

  //404 on unkown api routes
  app.get('/api/*', function(req, res){
    res.send('what???', 404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/', middleware.setUserCookie, index.index);
};
