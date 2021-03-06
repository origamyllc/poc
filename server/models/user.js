'use strict';

module.exports = function(mongoose) {
  var db = mongoose.connection,
      uniqueValidator = require('mongoose-unique-validator'),
      Schema = mongoose.Schema,
      crypto = require('crypto');
  
  var authTypes = ['github', 'twitter', 'facebook', 'google'],
      SALT_WORK_FACTOR = 10;
      
  var TYPE = 'User';

  /**
   * User Schema
   */
  var schema = new Schema({
    name: String,
    email: {
      type: String,
      unique: true
    },
    role: {
      type: String,
      default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {}
  });

  /**
   * Virtuals
   */
  schema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
      return this._password;
    });

  // Basic info to identify the current authenticated user in the app
  schema
    .virtual('userInfo')
    .get(function() {
      return {
        'name': this.name,
        'role': this.role,
        'provider': this.provider
      };
    });

  // Public profile information
  schema
    .virtual('profile')
    .get(function() {
      return {
        'name': this.name,
        'role': this.role
      };
    });
    
  /**
   * Validations
   */
  var validatePresenceOf = function(value) {
    return value && value.length;
  };

  // Validate empty email
  schema
    .path('email')
    .validate(function(email) {
      // if you are authenticating by any of the oauth strategies, don't validate
      if (authTypes.indexOf(this.provider) !== -1) return true;
      return email.length;
    }, 'Email cannot be blank');

  // Validate empty password
  schema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
      // if you are authenticating by any of the oauth strategies, don't validate
      if (authTypes.indexOf(this.provider) !== -1) return true;
      return hashedPassword.length;
    }, 'Password cannot be blank');

  /**
   * Plugins
   */
  schema.plugin(uniqueValidator,  { message: 'Value is not unique.' });

  /**
   * Pre-save hook
   */
  schema
    .pre('save', function(next) {
      if (!this.isNew) return next();

      if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
      else
        next();
    });

  /**
   * Methods
   */
  schema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
      return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
      if (!password || !this.salt) return '';
      var salt = new Buffer(this.salt, 'base64');
      return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
  };

  /**
   * Expose type to outside world.
   * @type {string}
   */
  schema.statics.TYPE = TYPE;

  return db.model(TYPE, schema);
};