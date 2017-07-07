var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')
var api = require('./api')

// allow CORS
app.use(cors())

// get secrets
var fs = require('fs')
var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))

// set up database
mongoose.connect('mongodb://' + secrets.username + ':' + secrets.password + '@ds145302.mlab.com:45302/euchre-call')

// configure bodyParser to work with app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set the port
var port = process.env.PORT || 8000

// create middleware to log information about all requests
app.use(function(req, res, next) {
  console.log('---NEW REQUEST---')
  console.log('Request Method:', req.method)
  console.log('Requst Route:', req.originalUrl)
  console.log('Time:', Date.now())
  next()
})

// prefix routes with api, use external router
app.use('/api', api)

// set app to actually do stuff
app.listen(port)
console.log('Euchre Call server running on port ' + port)
