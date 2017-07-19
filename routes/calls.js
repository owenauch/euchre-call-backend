// routes/calls.js
var express = require('express')
var auth = require('../middleware/auth')

// define models
var Call = require('../models/call')

var router = express.Router()

// create calls POST route
router.post('/create', auth, function(req, res) {
  var call = new Call(req.body)
  call.save(function(err) {
    if (err) {
      res.status(500)
      res.json({ errors: 'Your call failed to save!' })
    }
    res.json({ message: 'Your likely very sketchy call saved successfully!'})
  })
})

module.exports = router