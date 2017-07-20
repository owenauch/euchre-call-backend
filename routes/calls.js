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
      console.log('500: Call failed to save')
    }
    res.json({ message: 'Your likely very sketchy call saved successfully!'})
    console.log('200: Call saved successfully!')
  })
})

// user calls GET route
router.get('/:username', auth, function(req, res) {
  const username = req.params.username

  Call.count({ user: username }, function (error, userCount) {
    if (error) {
      res.status(500)
      res.json({ errors: 'An unknown server error occurred!' })
      console.log('ERROR', error)
    } else {
      Call.count({}, function (error, totalCount) {
        if (error) {
          res.status(500)
          res.json({ errors: 'An unknown server error occurred!' })
          console.log('ERROR', error)
        } else {
          res.status(200)
          res.json({
            userCount: userCount,
            totalCount: totalCount
          })
          console.log('200: Count data sent successfully!')
        }
      })
    }
  })
})

module.exports = router