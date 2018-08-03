const express = require("express")
const router = express.Router()

const jwt = require("jsonwebtoken")

// ****************************Databases are imported ***********************************

const User = require("../../models/user")

// ******************************Prerequisites *****************************************

const secretKey = require("../../config")["development"].secret // eslint-disable-line dot-notation
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
  }
}

