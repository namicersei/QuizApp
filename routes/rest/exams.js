// Databases ***************************************

const Question = require("../../models/question")
const Exam = require("../../models/exam")

// Function ****************************************

module.exports = {

// Take exam ***************************************

  takeExam(req, res) {
    if (!req.user.isAdmin) {
      // let questions
      return Question
      .find()
      .select("-correctAnswer")
      .limit(5)
      .exec()
      .then((data) => {
        const exam = new Exam({
          _user: req.user.id,
          _questions: data.map(ques => ques._id)
        })
        // questions = data
        return Promise.all([exam.save(), Promise.resolve(data)])
      })
      .then(([exam, data]) => res.json({
        examId: exam._id,
        questions: data
      }))
      .catch(err => res.status(500).json({
        msg: err.message
      }))
    }
    return res.status(400).json({
      msg: "Cannot give exam"
    })
  },

// Ccompute score ********************************************

  evaluateMarks(req, res) {
    let marks = 0
    const ansSheet = req.body.arrayOfAns
    Question
    .find({})
    .exec()
    .then((quesSet) => {
      ansSheet.forEach((element) => {
        const requiredQuestion = quesSet.find(ques => String(ques._id) === String(element.quesId))
        if (requiredQuestion.correctAnswer === element.ans) {
          marks += 1
        }
      })

      return res.json({ score: marks })
    })
    .catch((err) => {
      res.status(400).json({
        msg: err.message
      })
    })
  }
}
