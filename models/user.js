var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
})

UserSchema.methods.comparePassword = function(candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
      if (error) {
        return callBack(error, null)
      }
      callBack(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
