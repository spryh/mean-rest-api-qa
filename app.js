'use strict'

var express = require('express')
var app = express()
var routes = require('./routes')
var logger = require('morgan')


var jsonParser = require('body-parser').json

app.use(logger('dev'))
app.use(jsonParser())

var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
var port = 27017

mongoose.connect(`mongodb://localhost:${port}/qa`, {useMongoClient: true})
var db = mongoose.connection
db.on('error', (err)=>{
    console.error(`MongoDB connection error: ${err}`)
})
db.once('open', ()=>{
    console.log(`MongoDB connection successful on port ${port}`)
})

// CORS
app.use((req,res,next)=>{
    // Permits any domain access
    res.header('Access-Control-Allow-Origin', '*')
    // Permits requests with standard headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    //Pre-flight requests
    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'PUT,POST,DELETE')
        return res.status(200).json({})
    }
    next()
})


// ROUTING 
app.use('/questions', routes)

// Catch 404 forward to error handler
app.use((req,res,next)=>{
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler has extra err param
app.use((err, req,res,next)=>{
    res.status(err.status || 500)
    res.json({
        error: {
            message: `${err.status} - ${err.message}`
        }
    })
})

var port = process.env.PORT || 3000

app.listen(port, () => console.log(`Express Server listening on port ${port}`))