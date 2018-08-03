const express = require("express")
const router = express.Router()

const jwt = require("jsonwebtoken")

// ****************************Databases are imported ***********************************

const User = require("../../models/user")
const Exam = require("../../models/exam")
const Question = require("../../models/question")


// const app = require("../../app")

// ******************************Prerequisites *****************************************

const secretKey = "secretkey"
module.exports = {

  // *******************************REGISTRATION*******************************************

  register(req, res) {
    const user = new User(req.body)
    user
      .save()
      .then(data => res.status(200).json({
        msg: `Congrats! Welcome ${data.name.first}`
      }))
      .catch(err => res.status(500).json({
        msg: err.message
      }))
  },
  // ******************************LOGIN************************************************

  login(req, res) {
    const {
      email
    } = req.body

    return User
      .findOne({
        email
      })
      .exec()
      .then((user) => {
        if (!user) return res.status(500).json({ message: "Not a valid user!" })
        console.log(user)
        return user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              error: true,
              msg: err.message
            })
          }
          if (!isMatch) {
            return res.status(500).json({
              error: true,
              msg: "Password mismatch"
            })
          }
          const payload = {
            id: user._id,
            email: user.email,
            username: user.name.first,
            isAdmin: user.isAdmin
          }
          const token = jwt.sign(payload, secretKey)
          return res.status(200).send({
            error: false,
            msg: "Logged in successfully",
            token
          })
        })
      })
      .catch((err) => {
        res.status(403).json(err.message)
      })
  },

  //  ****************************Add questions ************************************************

  addQues(req, res) {
    if (req.user.isAdmin) {
      const question = new Question(req.body)
      console.log(req.body)
      return question.save()
        .then(data => res.json({
          msg: "Question saved !"
        }))
        .catch(err => res.status(400).json({
          msg: "Sorry!"
        }))
    }
    return res.status(500).json({
      msg: "invalid user"
    })
  },
  // **************************Take exam ***********************************************

  takeExam(req, res) {
    if (!req.user.isAdmin) {
      let questions
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
          questions = data
          return exam.save()
        })
        .then((exam) => {
          console.log(exam)
          return res.json({
            examId: exam._id,
            questions
          })
        })
        .catch(err => res.status(500).json({
          msg: "You cannot give the exam"
        }))
    }
    return res.status(400).json({
      msg: "Cannot give exam"
    })
  },

  // ************************* compute score ********************************************

  evaluateMarks(req, res) {
    let marks = 0
    // const i = 0
    const ansSheet = req.body.arrayOfAns
    console.log("**********************************", req.body)

    Question
      .find({})
      .exec()
      .then((quesSet) => {
        ansSheet.forEach((element) => {
          const requiredQuestion = quesSet.find(ques => String(ques._id) === String(element.quesId))
          // console.log(requiredQuestion)
          if (requiredQuestion.correctAnswer === element.ans) {
            marks += 1
          }
        })

        console.log(marks)
        return res.json({ score: marks })
      })
      .catch((err) => {
        console.log(err.message)
        res.status(400).json({
          msg: "Cannot compute score"
        })
      })
  }
}
