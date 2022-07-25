const express = require("express")
const router = express.Router()
const db = require("../database/db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const validateCreds = require("../middleware/validateCredentials")
const validateJwt = require("../middleware/validateJwt")
const { getUserTypeString, getUserTypeEnum } = require("../../usersEnum")

router.post("/register", validateCreds, async (req, res) => {
  const { email, password, name, userType } = req.body

  try {
    // 1. Check if user already exists
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [email])
    const isUserAlreadyExist = user.rows.length !== 0

    if (isUserAlreadyExist) {
      return res.status(401).json("User already exist!")
    }
    // 2. Hash password with bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    const bcryptPassword = await bcrypt.hash(password, salt)

    // 3. Get the correct user type (as string) for storing in db


    // if (isMerchant) userType = "merchant"
    // else if (isConsumer) userType = "consumer"
    // else if (isDeliverer) userType = "deliverer"
    // else throw new Error("Invalid user type")

    // 4. Insert new user into db
    const newUser = await db.query("INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *",
        [name, email, bcryptPassword, userType])

    // 5. Return jwt token as well as userType (to know which front end page to go to once logged in)
    const jwtToken = jwtGenerator(newUser.rows[0].user_id)

    res.json({ jwtToken, userType, userName: name })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
})


router.post("/login", validateCreds, async (req, res) => {
  
  try {
    // must return the info necessary to know which front end route to take
    const { email, password } = req.body
    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [email])

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid email or password!")
    }
    
    const isInvalidPassword = !await bcrypt.compare(password, user.rows[0].user_password)

    if (isInvalidPassword) {
      return res.status(401).json("Invalid email or password!")
    }

    const jwtToken = jwtGenerator(user.rows[0].user_id)
    const userType = user.rows[0].user_type
    const userName = user.rows[0].user_name

    res.json({ jwtToken, userType, userName });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }

})

router.get("/verify", validateJwt, async (req, res) => {
  try {
    res.json(true) // true meaning the user is verified
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
})

module.exports = router