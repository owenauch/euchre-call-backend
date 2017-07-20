var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var Call = require('./call')

// SCHEMA -- define the data fields
var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
})

// MIDDLEWARE -- hash password before saving
UserSchema.pre('save', function(next) {
  var user = this

  // don't rehash if the password isn't modified
  if (!user.isModified('password')) {
    return next()
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
    if (error) {
      return next(error)
    }

    // hash the password using new salt
    bcrypt.hash(user.password, salt, function(error, hash) {
      if (error) {
        return next(error)
      }

      user.password = hash
      next()
    })
  })
})    

// METHOD -- compare password to hashed password
UserSchema.methods.comparePassword = function(candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
      if (error) {
        return callBack(error, null)
      }
      callBack(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
