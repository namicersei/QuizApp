// Database ************************************

const Question = require("../../models/question")

// Function ***********************************

module.exports = {
  addQues(req, res) {
    // console.log(res.locals.isadmin)
    if (res.locals.isadmin) {
      const question = new Question(req.body)
      return question.save()
        .then(() => res.json({
          msg: "Question saved !"
        }))
        .catch(err => res.status(400).json({
          msg: err.message
        }))
    }
    return res.status(500).json({
      msg: "Invalid user"
    })
  }
}
