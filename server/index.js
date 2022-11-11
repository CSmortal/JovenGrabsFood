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
let delivererSocketObjArr = []
let orderNumber = 1
// io instance inherits all methods of main namespace
io.on("connection", (socket) => {


  socket.on('order', (itemsList, consumerDetails) => { // look at cartSlice.js to look at how cart looks like in store
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
          ordererDetails: consumerDetails, // {name: __, address: ___}
          orderItems: [item],
          orderId: orderNumber // even if food item A and B are from different merchants, they would have the same order id
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
        io.to(socketIdToSendTo).emit('processed order', value) // look at orderObj above, thats the structure of value here
        // if food item A and B are from diff merchants, they are sent separately to the socket
      }
      orderNumber++

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
    // console.log("Server has listened to consumerToServer")
    consumerSocketObjArr.push({
      consumerName,
      socket
    })
  })

  socket.on('delivererToServer', (delivererName) => {
    delivererSocketObjArr = delivererSocketObjArr.filter(socketObj => socketObj.delivererName !== delivererName)

    delivererSocketObjArr.push({
      delivererName,
      socket
    })
  })


  socket.on('order accepted', (orderItems, ordererDetails, orderId, merchantDetails) => {
    // notify ALL deliverers. They need to know the consumer's address and merchant's name and address
    for (const {delivererName, socket} of delivererSocketObjArr) {
      io.to(socket.id).emit('notify deliverers of new order', {orderItems, ordererDetails, orderId, merchantDetails})
    }


    // also notify the consumer so that their UI is updated
    const socketIdOfOrderer = consumerSocketObjArr.filter(socketObj => socketObj.consumerName === ordererDetails.name)[0].socket.id
    io.to(socketIdOfOrderer).emit('notify consumer of accepted order', {orderItems, ordererDetails, orderId, merchantDetails})
  })

  socket.on('order rejected', (orderItems, ordererDetails, orderId) => {
    // event fired from UnacceptedOrder.js
    // we want to notify the correct consumer (i.e orderer)

    const socketIdToSendTo = consumerSocketObjArr.filter(socketObj => socketObj.consumerName === ordererDetails.name)[0].socket.id
    io.to(socketIdToSendTo).emit('order rejection from server', "Your order was rejected")
  })

  socket.on('order ready for collection', (orderItems, ordererDetails, orderId, merchantDetails, delivererName) => {
    // emit to correct deliverer

    const socketIdOfDeliverer = delivererSocketObjArr.filter(socketObj.delivererName === delivererName)[0].socket.id
    io.to(socketIdOfDeliverer).emit('notify deliverer of order ready for collection', {orderItems, ordererDetails, orderId, merchantDetails})
  })

  socket.on('order assigned to a deliverer', (order) => {
    // except for this socket, we want to send emit an event to all deliverers
    // we could try that broadcast method later
    for (const {delivererName, socket: socketForDeliverer} of delivererSocketObjArr) {
      if (socket.id !== socketForDeliverer.id) {
        io.to(socketForDeliverer.id).emit('order already assigned to another deliverer', order)
      }
    }
  })

  socket.on('deliverer collected order', (order) => {
    const { ordererDetails } = order
    
    const consumerSockerId = consumerSocketObjArr.filter(socketObj => socketObj.consumerName === ordererDetails.name)[0].socket.id
    io.to(consumerSockerId).emit('notify consumer of order collection by deliverer')
  })

  socket.on('deliverer delivered order', (order) => {
    const { ordererDetails } = order
    
    const consumerSockerId = consumerSocketObjArr.filter(socketObj => socketObj.consumerName === ordererDetails.name)[0].socket.id
    io.to(consumerSockerId).emit('notify consumer that order has been delivered')
  })
})

httpServer.listen(5000, () => {
  console.log("Server listening on port 5000")
})