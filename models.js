'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var sortAnswers = function(a,b){
    // return (-)negative value to take precedence
    // if a is "more recent" (more milliseconds) than b
    // or a has more votes than b
    if(b.votes == a.votes){
         return b.updatedAt - a.updatedAt
    }
    return b.votes - a.votes
}

var AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0},
})

// Use .method to name and define the instance method
// When answer is updated, apply the current time to the answer document
AnswerSchema.method('update', function(updates, callback) {
    // Merge the update to the answer document
    Object.assign(this, updates, {updatedAt: new Date()})
    this.parent().save(callback)
})

// When answer is voted, apply the current time to the answer document
AnswerSchema.method('vote', function(vote, callback) {
    if (vote == 'up'){this.votes += 1}
    else {this.votes -= 1}
    this.parent().save(callback)
})

var QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
})

// Save Prehook using the sortAnswers function
QuestionSchema.pre('save', function(next){
    this.answers.sort(sortAnswers)
    next()
})

var Question = mongoose.model("Question", QuestionSchema)

module.exports.Question = Question