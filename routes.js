"use strict"

var express = require("express")
var router = express.Router()
var Question = require('./models').Question

// Param handler for question id
router.param('qid', (req,res,next,id)=>{
    Question.findById(id, (err,doc)=>{
        if(err) {return next(err)}
        if(!doc) {
            err = new Error('Not Found')
            err.status = 404
            return next(err)
        }
        req.question = doc
        return next()
    })
})

// Param handler for answer id
router.param('aid', (req,res,next,id)=>{
    req.answer = req.question.answers.id(id)
    if(!req.answer) {
        err = new Error('Not Found')
        err.status = 404
        return next(err)
    }
    next()
})


// API root is /questions, so leave that off all routes

// GET /questions
// Route for retrieving all questions
router.get("/", (req, res, next) => {
    // Question.find({}, null, {sort: {createdAt: -1}}, (err,questions)=>{
    //     if(err) return next(err)
    //     res.json(questions)
    // })
    Question.find({})
    .sort({createdAt: -1})
    .exec((err,questions)=>{
        if(err) return next(err)
        res.json(questions)
    })
//   res.json({ response: "You sent me a GET request" })
})

// POST /questions
// Route for creating questions
router.post("/", (req, res, next) => {
    var question = new Question(req.body)
    question.save((err,question)=>{
        if(err) {return next(err)}
        // Return 201 to indicate document saved successfully
        res.status(201)
        res.json(question)
    })
    // res.json({ 
    //     response: "You sent me a POST request",
    //     body: req.body
    // })
})

// GET /questions/:id
// Route for retrieving specific questions
router.get("/:qid", (req, res) => {
    /* This was without the param handler on line 7
    Question.findById(req.params.qid, (err,doc)=>{
        if(err) {return next(err)}
        res.json(doc)
    }) 
    */
    res.json(req.question)
    // res.json({ response: `You sent me a GET request for qid:${req.params.qid}` })
})

// POST /questions/:id/answers
// Route for creating answers
router.post("/:qid/answers", (req, res, next) => {
    req.question.answers.push(req.body)
    // Similar to line 41
    req.question.save((err,question)=>{
        if(err) {return next(err)}
        res.status(201)
        res.json(question)
    })
/*     res.json({ 
        response: `You sent me a POST request to /answers}`,
        questionId: req.params.qid,
        body: req.body
    }) */
})

// PUT /questions/:id/answers/:aid
// Route for editing answers
router.put("/:qid/answers/:aid", (req, res) => {
    req.answer.update(req.body, (err, result)=>{
        if(err) return next(err)
        res.json(result)
    })

    /* res.json({ 
        response: `You sent me a PUT request to /answers/${req.params.aid}`,
        questionId: req.params.qid,
        answerId: req.params.aid,
        body: req.body
    }) */
})

// DELETE /questions/:qid/answers/:aid
// Route for deleting answers
router.delete("/:qid/answers/:aid", (req, res) => {
    req.answer.remove((err)=>{
        req.question.save((err, question)=>{
            if(err) return next(err)
            res.json(question)
        })
    })

    /* res.json({ 
        response: `You sent me a DELETE request to /answers/${req.params.aid}`,
        questionId: req.params.qid,
        answerId: req.params.aid,
    }) */
})

// POST /questions/:qid/answers/:aid/voteUp
// POST /questions/:qid/answers/:aid/voteDown
// Route for voting up/down answers
router.post("/:qid/answers/:aid/vote-:direction", 
    (req, res, next) => {
        if(req.params.direction.search(/^(up|down)$/) == -1) {
            var err = new Error('Not Found. Invalid syntax.')
            err.status = 404
            next(err)
        } else {
            req.vote = req.params.direction
            next()}
    },
    (req, res, next) => {
        req.answer.vote(req.vote, (err,question)=>{
            if(err) {return next(err)}
            res.json(question)
        })
        /* res.json({ 
            response: `You sent me a POST request to /answers/${req.params.aid}/vote/${req.params.direction}`,
            questionId: req.params.qid,
            answerId: req.params.aid,
            vote: req.params.direction
         }) */
    }
)

module.exports = router
