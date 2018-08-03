const express = require("express")
const router = express.Router()

var expressJwt = require("express-jwt")
var jwt = require('jsonwebtoken')

const { verify } = require("../../middlewares")
const users = require("./users")
const { secret } = require("../../config")[process.env.NODE_ENV || "development"]

// Routes *********************************************************************

router.post("/register", users.register)
router.post("/login", users.login)

router.use(expressJwt({ secret })) // this middleware will be used for all subsequent routes

router.post("/addques", users.addQues) //
router.get("/takeexam", users.takeExam) //
router.post("/score", users.evaluateMarks) //

module.exports = router
