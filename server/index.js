const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const httpServer = http.createServer(app)
const { Server } = require("socket.io")


const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  }
})



app.use(cors())
app.use(express.json())

app.use("/auth", require("./routes/authentication"))
app.use("/aws", require("./routes/aws"))
app.use("/db", require("./routes/db"))


let merchantSocketObjArr = []
let consumerSocketObjArr = []
// io instance inherits all methods of main namespace
io.on("connection", (socket) => {


  socket.on('order', (itemsList, consumerName) => { // look at cartSlice.js to look at how cart looks like in store
    // should emit a repackaged order from the room for each merchant
    const merchantToItemMap = new Map()
    for (const [key, item] of Object.entries(itemsList)) {
      const mercNameAsKey = item.basicDetails.merchantName
      if (merchantToItemMap.has(mercNameAsKey)) {
        let orderObj = merchantToItemMap.get(mercNameAsKey)
        orderObj.items.push(item)
        merchantToItemMap.set(mercNameAsKey, orderObj)
      } else {
        // NOTE: This is how an order object looks like
        const orderObj = { 
          nameOfOrderer: consumerName,
          items: [item]
        }
        merchantToItemMap.set(mercNameAsKey, orderObj)
      }
    }
    // itemsList is an object with as many properties as the number of item objects, each property is the index
    // console.log("Socket id of socket listening to order: " + socket.id)
    // for each key in the map, we send an order
    try {
      for (const [key, value] of merchantToItemMap) {
        const socketIdToSendTo = merchantSocketObjArr.filter(socketObj => socketObj.merchantName === key)[0].socket.id
        io.to(socketIdToSendTo).emit("send order", value) // look at orderObj above, thats the structure of value here
      }
    } catch (error) {
      console.error(error.message)
    }

  })

  socket.on('merchantToServer', (merchantName) => {
    // need to remove any socket for this merchant, in the case where the merchant page is refreshed and the socket emits again
    merchantSocketObjArr = merchantSocketObjArr.filter(socketObj => socketObj.merchantName !== merchantName)

    // push this socket as an obj tgt with the merchant name to the arr, and make this socket join the room for this merchant
    merchantSocketObjArr.push({
      merchantName,
      socket
    })

  })

  socket.on('consumerToServer', (consumerName) => {
    consumerSocketObjArr = consumerSocketObjArr.filter(socketObj => socketObj.consumerName !== consumerName)

    consumerSocketObjArr.push({
      consumerName,
      socket
    })
  })


  socket.on('order rejection', (order, ordererName) => {
    // event fired from UnacceptedOrder.js
    // we want to notify the correct consumer (i.e orderer)

    const socketIdToSendTo = consumerSocketObjArr.filter(socketObj => socketObj.consumerName === ordererName)[0].socket.id
    io.to(socketIdToSendTo).emit("order rejection from server", "Your order was rejected")
  })
})

httpServer.listen(5000, () => {
  console.log("Server listening on port 5000")
})