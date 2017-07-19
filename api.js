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
    res.status(401)
    return res.json({ errors: 'Unauthorized, please log in' })
}

// login POST route
router.post('/users/login', function(req, res) {
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
router.post('/users/create', function(req, res) {
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
router.get('/users/logout', function (req, res) {
  req.session.destroy()
  res.sendStatus(200)
})

// create calls POST route
router.post('/calls', auth, function(req, res) {
  var call = new Call(req.body)
  call.save(function(err) {
    if (err) {
      res.status(500)
      res.json({ errors: 'Your call failed to save!' })
    }
    res.json({ message: 'Your likely very sketchy call saved successfully!'})
  })
})

module.exports = {
  router: router,
  auth: auth
}
