const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")

const users = require("./users")
const questions = require("./questions")
const exams = require("./exams")

const { secret } = require("../../config")[process.env.NODE_ENV || "development"]
const verify = require("../../middlewares").verify
// Routes *********************************************************************

router.post("/register", users.register) // This route is used to register
router.post("/login", users.login) // This route is used to login
router.post("/addques", verify, questions.addQues) // This route is used to add questions by only the admin

router.use(expressJwt({ secret })) // This middleware will be used for all subsequent routes

router.get("/takeexam", exams.takeExam) // This route is used to take exams by the users
router.post("/score", exams.evaluateMarks) // This route is used to get the scores by the users

module.exports = router
