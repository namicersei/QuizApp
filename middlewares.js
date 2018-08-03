const jwt = require("jsonwebtoken")

const secretKey = "secretkey"

module.exports = {
  verify(req, res, next) {
    const token = (req.headers.authorization).split(' ').pop()
    const decoded = jwt.verify(token, secretKey)
    if (decoded) {
      res.locals.isadmin = decoded.isAdmin
      next()
    } else {
      res.status(400).send("Not a valid user!")
    }
  }
}
