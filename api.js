var express = require('express')
var router = express.Router()

// define call model
var Call = require('./call')

// create calls POST route
router.route('/calls')
  .post(function(req, res) {
    var call = new Call(req.body)
    call.save(function(err) {
      if (err) {
        res.send(err)
      }
      res.json({ message: 'Your likely very sketchy call saved successfully!'})
    })
  })



module.exports = router