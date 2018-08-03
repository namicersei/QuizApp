const mongoose = require("mongoose")

const ExamSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"

  },
  _questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  score: {
    type: Number,
  },
  performance: {
    type: String
  }
})

module.exports = mongoose.model("Exam", ExamSchema)
