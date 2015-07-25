'use strict';

module.exports = function(mongoose) {

 var db = mongoose.connection,
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate,
    _ = require('lodash'),
    logger = require('../logger'),
    autoIncrement = require('mongoose-auto-increment');

  autoIncrement.initialize(db);

    
  var TYPE = 'Device';


  var schema = new Schema({
    name: {
      type: String,
      required: true,
       unique: true,
      validate: [validate({
        message: 'min.length:3'
      }, 'len', 3)]
    },
     status: {
      type: String,
      enum: {
        values: ['Added', 'configuring'],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
      },
      default: 'Added',
      required: true,
    },
     state:{
     type: String,
      enum: {
        values: ['on', 'off'],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
      },
      default: 'off',
      required: true,

     },
    ipaddress: {type:String,required: true},
    deviceType:{
      type: String,
      required: true,
      default: 'Thingy-basic'
    },
    note: {type: String},
    sensors:{
      sensorId: {
        type: Number,
        required: false
      }
    },
     organizationId: {
        type: Number,
        required: false
      }
  });
  
  /**
   * Methods
   */
  schema.methods = {

  };
  
  /**
   * Expose type to outside world.
   * @type {string}
   */
  schema.statics.TYPE = TYPE;

  return db.model(TYPE, schema);
};
