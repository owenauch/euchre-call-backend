var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CallSchema = new Schema({
  hand: {
    ace: Boolean,
    king: Boolean,
    queen: Boolean,
    jack: Boolean,
    ten: Boolean,
    nine: Boolean
  },

  trump: String,
  plusMinus: String,

  wonHand: Boolean,

  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Call', CallSchema)