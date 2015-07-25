'use strict';

var request = require('request');
var moment = require('moment');


var  deviceStatus;
/**
relayResponse = {
        device: {
          deviceId:1,
          deviceName:"",
          deviceModel:"",
          deviceStatus:"",
          deviceRating:{},
          relay:{
          	  relayId:"",
          	  outPin:"",
              relayRating:{}
          },
          noOfTimesSwitchedOn:0,
          lastSwitchedOnAt:0,
          totalTime:0,
          timetoSwitchOn:0
        }
      };
      */
  
 var noOfTimesSwitchedOn=0;
 var outpinNo=12,
   timeTurnedOn=0 ,
   duration=0, 
   timeTurnedOff=0,
   relayResponse = {},
   totalTime=0;

exports.toggleSwitch= function(req, res) {
    var action = req.params.action;
console.log(action );
    var response ={};
    if(action==='on'){
	    makeToggleRequest('1');
	    ++noOfTimesSwitchedOn;
	   timeTurnedOn = moment().format("DD/MM/YYYY HH:mm:ss");

    }
    else  if(action==='off'){
    	makeToggleRequest('0');
    	timeTurnedOff = moment().format("DD/MM/YYYY HH:mm:ss");
    	
    }

    var ms = moment(timeTurnedOff,"DD/MM/YYYY HH:mm:ss").diff(moment(timeTurnedOn,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    duration = Math.floor(d.asHours()) + moment.utc(ms).format("HH:mm:ss");
   
 //TODO:figure out how to add time 
    relayResponse = { 
    	deviceStatus:action,
    	noOfTimesSwitchedOn:noOfTimesSwitchedOn,
    	lastSwitchedOnAt:timeTurnedOn,
    	lastSwitchedOffAt:timeTurnedOff,
    	duration:duration,
    	totalTime:totalTime
     };
  

   return res.json(200, relayResponse);	
};

function makeToggleRequest(signal){
	request('http://spool.local/arduino/digital/12/'+ signal, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		     // Print the google web page.
		    var responseStr = body.split(" ");
		  }
		  else{
		  	  console.log(error)
		  	}
		});
}