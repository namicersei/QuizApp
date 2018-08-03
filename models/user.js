const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const UserSchema = new mongoose.Schema({


  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  name: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },


})

// Save user's hashed password
UserSchema.pre("save", function (next) {
  const user = this
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err)
        return
      }
      bcrypt.hash(user.password, salt, null, (err1, hash) => {
        if (err1) {
          return next(err)
        }
        // saving actual password as hash
        user.password = hash
        return next()
      })
    })
  } else {
    next()
  }
})

// compare two passwords

UserSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    return cb(null, isMatch)
  })
}

UserSchema.virtual("name.full").get(function () {
  const last = (this.name.last === undefined || this.name.last === null) ? "" : this.name.last
  return `${this.name.first} ${last}`
})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("User", UserSchema)
