var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CallSchema = new Schema({
  hand: {
    right: Boolean,
    left: Boolean,
    ace: Boolean,
    king: Boolean,
    queen: Boolean,
    ten: Boolean,
    nine: Boolean
  },

  trump: String,
  plusMinus: String,

  wonHand: Boolean,

  user: String,

  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Call', CallSchema)