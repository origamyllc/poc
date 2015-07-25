/**
 * Created by lcranford on 3/04/14.
 */
'use strict';
var request = require('request');
 var  messageHelper = require('./../messaging/rabbitmq-helper'),
 current=0,
amplitude_current=0.0,
effective_value=0.0,
power=0,
effective_voltage = 110;
var message = new messageHelper();

exports.measureCurrent = function(req, res) {

	   getCurrent()
	    
       effective_value=((.0049 * current) - 2.5)/.066;

       power=(effective_value*effective_voltage)/10;

       message.write({power:Math.abs(power)});


	  return res.json(200, {
	
	  	effective_value:{
	  		value:Math.abs(effective_value),
	  		unit:'mA'
	  	},
	  		power:{
	  		value:Math.abs(power),
	  		unit:'W'
	  	}
	  });	
}


function getCurrent(){
	request('http://spool.local/arduino/analog/0', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		     // Print the google web page.
		    var responseStr = body.split(" ");
		
		   current= responseStr[4];

		  }
		  else{
		  	  console.log(error)
		  	}
		});
}