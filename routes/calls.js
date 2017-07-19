// routes/calls.js
var express = require('express')

// define models
var Call = require('../models/call')

var router = express.Router()

// session authentication middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user)
    return next()
  else
    res.status(401)
    return res.json({ errors: 'Unauthorized, please log in' })
}

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