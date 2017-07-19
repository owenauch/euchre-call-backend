var express = require('express')
var session = require('express-session')

var usersRouter = require('./users')
var callsRouter = require('./calls')

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

router.use('/users', usersRouter)
router.use('/calls', callsRouter)

module.exports = {
  router: router
}
