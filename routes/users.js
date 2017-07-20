var express = require('express')
var auth = require('../middleware/auth')
var User = require('../models/user')

var fs = require('fs')
var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))

var router = express.Router()

// login POST route
router.post('/login', function(req, res) {
  var username = req.body.username
  var password = req.body.password

  // check user password against password in DB
  User.findOne({ username: username }, function(error, user) {
    if (error) {
      res.status(500)
      res.json({ errors: 'An unknown server error occurred!' })
      console.log('ERROR', error)
    } else if (!user) {
      res.status(401)
      res.json({ errors: 'Could not find user in database, try again with different username!'})
      console.log('401: Could not find user in database')
    } else {
      user.comparePassword(password, function(error, isMatch) {
        if (error) {
          res.status(500)
          res.json({ errors: 'An unknown server error occurred!' })
          console.log('ERROR', error)
        } else if (isMatch) {
          req.session.user = username
          res.status(200)
          res.json({ username: username })
          console.log('200: User logged in successfully!')
        } else {
          res.status(401)
          res.json({ errors: 'User password is not correct!' })
          console.log('401: User password did not match database')
        }
      })
    }
  })
})

// create account POST route
router.post('/create', function(req, res) {
  var username = req.body.username
  var password = req.body.password
  var secret = req.body.secret

  // check secret against create account secret
  if (secret === secrets.createAccountSecret) {
    var user = new User({ username: username, password: password })
    user.save(function(error) {
      if (error) {
        console.log('ERROR', error)
        res.status(500)
        res.json({ errors: 'An unknown server error occurred!' })
      } else {
        req.session.user = username
        console.log('200: User created successfully!')
        res.sendStatus(200)
      }
    })
  } else {
    console.log('401: Wrong secret code, unable to create account.')
    res.status(401)
    res.json({ errors: 'Wrong secret code, unable to create account' })
  }
})

// logout GET route
router.get('/logout', function (req, res) {
  req.session.destroy()
  res.sendStatus(200)
})

module.exports = router