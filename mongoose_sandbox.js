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
        mass: {type: Number, default: '.007'},
        name: {type: String, default: 'Angela'},
        size: {type: String, default: 'Undetermined'}
    })

    /* 
    Mongoose pre hooks explicitly rely on passing the document through this rather than as a parameter. 
    Fat arrows won't work with this paradigm. You should use an anonymous function instead 
    (i.e., function() {} instead of (next)>{}) TRY IT OUT and it will break!
    */

    AnimalSchema.pre('save', function(next){
        // console.log(`\n${this}`);
        if(this.mass >= 100){ this.size= "big"}
        else if(this.mass >= 5 && this.mass < 100){ this.size= 'medium'}
        else { this.size= 'small'} 
        // console.log(this);
        next()
    })

    // Static methods are called on model objects
    AnimalSchema.statics.findSize = function(size,callback){
        // this == Animal
        return this.find({size:size}, callback)
    }

    // Instance methods are called on document objects
    AnimalSchema.methods.findSameColor = function(callback){
        // this == document
        return this.model('Animal').find({color:this.color}, callback)
    }

    // Model will create and save object
    var Animal = mongoose.model('Animal', AnimalSchema)

    var elephant = new Animal({
        type: 'elephant',
        color: 'grey',
        mass: 6000,
        name: 'Lawrence'
    })

    var animal = Animal({}) // Create a generic animal

    var whale = new Animal({
        type: 'whale',
        mass: 190500,
        name: 'Big Blue'
    })
    
    var animalData = [
        {
            type: 'mouse',
            color: 'grey',
            mass: 0.035,
            name: 'Marvin'
        },
        {
            type: 'nutria',
            color: 'brown',
            mass: 6.035,
            name: 'Gretchen'
        },
        {
            type: 'wolf',
            color: 'grey',
            mass: 45,
            name: 'Iris'
        },
        elephant,
        animal,
        whale
    ]

    // Welcome to the nested callback "Pyramid of Doom"
    Animal.remove({}, (err)=>{
        if(err){console.error('Animal Remove Error', err)}
        Animal.create(animalData, (err, animals)=>{
            if(err){console.error('Whale save failed.', err)}
            Animal.findOne({type:"elephant"}, (err, elephant) =>{
                elephant.findSameColor(function(err, animals){
                    if(err){console.error(err)}
                    animals.forEach((animal)=>{
                        console.log(`${animal.name} is a ${animal.size} ${animal.color} ${animal.type}`)
                    })
                    db.close(()=>{
                    console.log('MongoDB connection closed.')
                    })
                })  
            })
        })
    })
})