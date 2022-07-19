const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.get("token") // get() returns specified header field

    if (!jwtToken) {
      return res.status(403).json("Not Authorised!")
    }
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)
    next()

  } catch (error) {
    console.error(error.message)
    return res.status(403).json("Not Authorised")
  }

  
}