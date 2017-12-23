'use strict'

var mongoose = require('mongoose')
// DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, 
// plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

var port = 27017

// Connect to mongodb sandbox db at path. 
// http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect(`mongodb://localhost:${port}/sandbox`, {useMongoClient: true})

// Monitor status of requests using mongoose connection object
var db = mongoose.connection

// Listen for error event
db.on('error', (err)=>{
    console.error(`MongoDB connection error: ${err}`)
})

// Fire handler when event occurs
db.once('open', ()=>{
    console.log(`MongoDB connection successful on port ${port}`)
    // DB communication goes here
    var Schema = mongoose.Schema
    var AnimalSchema = new Schema({
        type: {type: String, default: 'goldfish'},
        color:{type: String, default: 'orange'},
        size: {type: String, default: 'small'},
        mass: {type: Number, default: '.007'},
        name: {type: String, default: 'Angela'}
    })
    // Model will create and save object
    var Animal = mongoose.model('Animal', AnimalSchema)

    var elephant = new Animal({
        type: 'elephant',
        size: 'big',
        color: 'grey',
        mass: 6000,
        name: 'Lawrence'
    })

    var animal = Animal({}) // Create a generic animal

    var whale = new Animal({
        type: 'whale',
        size: 'big',
        mass: 190500,
        name: 'Big Blue'
    })
    

    // Welcome to the nested callback "Pyramid of Doom"
    Animal.remove({}, ()=>{
        //if(err){console.error('Animal Remove Error', err)}
        elephant.save((err)=>{
            if(err){console.error('Elephant save failed.', err)}
            animal.save((err)=>{
                if(err){console.error('Animal save failed.', err)}
                whale.save((err)=>{
                    if(err){console.error('Whale save failed.', err)}
                    Animal.find({size: 'big'}, (err, animals) =>{
                        animals.forEach((animal)=>{
                            console.log(`${animal.name} the ${animal.color} ${animal.type}`)
                        })
                        db.close(()=>{
                        console.log('MongoDB connection closed.')
                        })
                    })
                })
            })
        })
    })
})