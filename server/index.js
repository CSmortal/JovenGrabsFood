const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const cors = require("cors")

app.use(cors())
app.use(express.json())

app.use("/auth", require("./routes/authentication"))


server.listen(5000, () => {
  console.log("Server listening on port 5000")
})