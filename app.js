'use strict'

var express = require('express')
var app = express()
var routes = require('./routes')
var logger = require('morgan')


var jsonParser = require('body-parser').json

app.use(logger('dev'))
app.use(jsonParser())
app.use('/questions', routes)

var port = process.env.PORT || 3000

app.listen(port, () => console.log(`Express Server listening on port ${port}`))