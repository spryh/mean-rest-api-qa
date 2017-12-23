"use strict"

var express = require("express")
var router = express.Router()

// API root is /questions, so leave that off all routes

// GET /questions
// Route for retrieving all questions
router.get("/", (req, res) => {
  res.json({ response: "You sent me a GET request" })
})

// POST /questions
// Route for creating questions
router.post("/", (req, res) => {
    res.json({ 
        response: "You sent me a POST request",
        body: req.body
    })
})

// GET /questions/:id
// Route for retrieving specific questions
router.get("/:qid", (req, res) => {
    res.json({ response: `You sent me a GET request for qid:${req.params.qid}` })
  })

// POST /questions/:id/answers
// Route for creating answers
router.post("/:qid/answers", (req, res) => {
    res.json({ 
        response: `You sent me a POST request to /answers}`,
        questionId: req.params.qid,
        body: req.body
    })
})

// PUT /questions/:id/answers/:aid
// Route for editing answers
router.put("/:qid/answers/:aid", (req, res) => {
    res.json({ 
        response: `You sent me a PUT request to /answers/${req.params.aid}`,
        questionId: req.params.qid,
        answerId: req.params.aid,
        body: req.body
    })
})

// DELETE /questions/:qid/answers/:aid
// Route for deleting answers
router.delete("/:qid/answers/:aid", (req, res) => {
    res.json({ 
        response: `You sent me a DELETE request to /answers/${req.params.aid}`,
        questionId: req.params.qid,
        answerId: req.params.aid,
    })
})

// POST /questions/:qid/answers/:aid/voteUp
// POST /questions/:qid/answers/:aid/voteDown
// Route for voting up/down answers
router.post("/:qid/answers/:aid/vote-:direction", (req, res) => {
    res.json({ 
        response: `You sent me a POST request to /answers/${req.params.aid}/vote/${req.params.direction}`,
        questionId: req.params.qid,
        answerId: req.params.aid,
        vote: req.params.direction
    })
})

module.exports = router
