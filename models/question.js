const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },

  answerOptions: [{
    type: String,
    required: true
  }],

  correctAnswer: {
    type: String,
    required: true
  },

  createdOn: {
    type: Date,
    default: Date.now
  }
})


module.exports = mongoose.model("Question", QuestionSchema)
