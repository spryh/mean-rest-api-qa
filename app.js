'use strict'

var express = require('express')

var app = express()

var port = process.env.PORT || 3000

// app.use((request, response, next)=>{
//     //console.log('First piece of middleware.')
//     request.myMessage = 'Hello Middleware #2!'
//     next()
// })

// app.use((request, response, next)=>{
//     //console.log(`Second piece of middleware, ID: ${request.params.id}`)
//     console.log(request.myMessage)
//     next()
// })

app.use((request, response, next)=>{
    console.log(`The leaves on the trees are ${request.query.color}`)
    next()
})

app.listen(port, () => console.log(`Express Server listening on port ${port}`))