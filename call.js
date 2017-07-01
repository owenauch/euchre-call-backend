var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CallSchema = new Schema({
  hand: {
    ace: String,
    king: String,
    queen: String,
    jack: String,
    ten: String,
    nine: String
  },

  trump: String,
  plusMinus: String,

  wonHand: Boolean,

  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Call', CallSchema)