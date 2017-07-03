var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')

// allow CORS
app.use(cors())

// get secrets
var fs = require('fs')
var secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))

// get our call model
var Call = require('./call')

// set up database
mongoose.connect('mongodb://' + secrets.username + ':' + secrets.password + '@ds145302.mlab.com:45302/euchre-call')

// configure bodyParser to work with app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set the port
var port = process.env.PORT || 8000

// create the router
var router = express.Router()

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// create middleware to log information about all requests
router.use(function(req, res, next) {
  console.log('---NEW REQUEST---')
  console.log('Request Method:', req.method)
  console.log('Time:', Date.now())
  next()
})

// prefix routes with api
app.use('/api', router)

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

// set app to actually do stuff
app.listen(port)
console.log('Euchre Call server running on port ' + port)
