var express = require('express')
var session = require('express-session')

// define models
var Call = require('./models/call')
var User = require('./models/user')

// get secrets
var fs = require('fs')
var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))

var router = express.Router()

// setup and use session
router.use(session({
    secret: secrets.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

// session authentication middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user)
    return next()
  else
    return res.sendStatus(401)
}

// create login POST route
router.post('/login', function(req, res) {
  var username = req.body.username
  var password = req.body.password

  // check user password against password in DB
  User.findOne({ username: username }, function(error, user) {
    if (error) {
      return res.sendStatus(400)
      console.log('ERROR', error)
    } else {
      user.comparePassword(password, function(error, isMatch) {
        if (error) {
          return res.sendStatus(401)
          console.log('ERROR', error)
        } else {
          req.session.user = username
          res.sendStatus(200)
        }
      })
    }
  })
})

// create logout GET route
router.get('/logout', function (req, res) {
  req.session.destroy()
  res.sendStatus(200)
})

// create calls POST route
router.post('/calls', auth, function(req, res) {
  var call = new Call(req.body)
  call.save(function(err) {
    if (err) {
      res.send(err)
    }
    res.json({ message: 'Your likely very sketchy call saved successfully!'})
  })
})



module.exports = router
