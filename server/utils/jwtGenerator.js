const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = function jwtGenerator(user_id) {
  const payload = 
    {
      user_id
    }

  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"})
}