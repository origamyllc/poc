'use strict';

module.exports = function(mongoose) {

 var db = mongoose.connection,
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate,
    _ = require('lodash'),
    logger = require('../logger'),
    autoIncrement = require('mongoose-auto-increment');

  autoIncrement.initialize(db);

    
  var TYPE = 'Organization';



  var addressSchema = new Schema({
    address1: {
       type: String,
       required: true
    },
     address2: {
       type: String,
       required: true
    },
     city: {
       type: String,
       required: true
    },
    state: {
       type: String,
       required: true
    },
   zip: {
       type: Number,
       required: true
    },
   zone: {
       type: Number,
       required: true
    }
  });


  var schema = new Schema({
    _id: {
      type: Number,
      unique:true,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
       unique: true,
      validate: [validate({
        message: 'min.length:3'
      }, 'len', 3)]
    },
    address: [addressSchema],
    orgType:{
      type: String,
      required: true,
      default: 'Thingy-basic'
    },
    devices:{
      deviceId: {
        type: Number,
        required: true
      }
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
