// middleware/auth
var express = require('express')
var session = require('express-session')

// session authentication middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user)
    return next()
  else
    res.status(401)
    return res.json({ errors: 'Unauthorized, please log in' })
}

module.exports = auth