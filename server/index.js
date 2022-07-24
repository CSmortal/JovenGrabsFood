const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const cors = require("cors")



app.use(cors())
app.use(express.json())

app.use("/auth", require("./routes/authentication"))
app.use("/aws", require("./routes/aws"))
app.use("/db", require("./routes/db"))

// app.post('/image', upload.single('imageInput'), function(req, res, next) {
//   console.log(req.file)
// })

server.listen(5000, () => {
  console.log("Server listening on port 5000")
})