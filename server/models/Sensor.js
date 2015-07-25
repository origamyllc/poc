'use strict';

module.exports = function(mongoose) {

 var db = mongoose.connection,
    Schema = mongoose.Schema,
    validate = require('mongoose-validator').validate,
    _ = require('lodash'),
    logger = require('../logger'),
    autoIncrement = require('mongoose-auto-increment');

  autoIncrement.initialize(db);

    
  var TYPE = 'Sensor';


  var schema = new Schema({
    name: {
      type: String,
      required: true,
       unique: false,
      validate: [validate({
        message: 'min.length:3'
      }, 'len', 3)]
    },
    Type: {
       type: String,
       enum: {
        values: ['Analog', 'Digital'],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
      },
      default: 'Analog',
       required: false
    },
     status: {
       type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
      },
      default: 'Active',
      required: true
    },
     details: {
       model: {
       type: String,
       required: false,
       default: 'Unknown'
      }
    },
      addedDate: {
      type: Date,
      required: true
    },
    deviceId: {
      type: String,
      required: true
    },
     inputPin: {
      type: Number,
      enum: {
        values: ['1', '2','3','4','5','6','7','8','9','10'],
        message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
      },
      default: '1',
      required: true
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
