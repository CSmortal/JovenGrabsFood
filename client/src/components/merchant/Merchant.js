import Logout from "../others/Logout";
import { Fragment, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import UnacceptedOrder from "./UnacceptedOrder";
import { useDispatch, useSelector } from "react-redux";
import { unacceptedOrderSliceActions } from "../../store/unacceptedOrderSlice";
import AcceptedOrder from "./AcceptedOrder";


export default function Merchant() {
  let merchantDetails = useSelector(state => state.userDetails)
  const navigate = useNavigate()
  const [socket, setSocket] = useState()
  let counter = 1
  const dispatch = useDispatch()
  const { orderList: unacceptedOrderList } = useSelector(state => state.unacceptedOrder)
  const { orderList: acceptedOrderList } = useSelector(state => state.acceptedOrder) 

  // remove later, this is for dev convenience
  if (merchantDetails.name === "" && merchantDetails.address === "") {
    merchantDetails = localStorage.getItem("userDetails")
    // console.log(JSON.stringify(localStorage.getItem("userDetails")))
    // console.log(JSON.stringify(merchantDetails))
  }

  console.log(merchantDetails)

  useEffect(() => {
    const socket = io("http://localhost:5000")

    setSocket(socket)

    // socket.on('connect', () => {
    //   console.log("Merchant connected to server socket")
    // })

    // socket.on('disconnect', () => {
    //   console.log("Merchant disconnected from server socket")
    // })

    socket.on('processed order', (orderObj) => {
      /* orderObj looks like: { 
          ordererDetails: consumerDetails, // {name: __, address: ___}
          orderItems: [item],
          orderId: orderNumber // even if food item A and B are from different merchants, they would have the same order id
        } */

      dispatch(unacceptedOrderSliceActions.addOrder({ 
        ...orderObj, 
        merchantDetails, // { name: , address: }
      }))
    })

    // for each merchant, we want to store this socket on server side in an array, and make it join a room
    socket.emit('merchantToServer', localStorage.getItem("userName"))

    return () => {
      // socket.off('connect')
      // socket.off('disconnect')
      socket.off('processed order')
    }

  }, [dispatch, merchantDetails])
  

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{justifyContent: "space-between"}}>
          <Typography variant="h5">JovenGrabsFood</Typography>

          <Avatar>{localStorage.getItem("userName")}</Avatar>
        </Toolbar>
      </AppBar>

      <>
        <Typography variant="h3">Merchant</Typography>

        <Logout />

        <Typography variant="h4" sx={{mt: 3, mb: 2, display: "flex", justifyContent: "center"}}>Unaccepted Orders</Typography>

        <div className="unacceptedOrders">
          {unacceptedOrderList.length > 0 
            ? unacceptedOrderList.map(orderObj => {

              return (
                <UnacceptedOrder 
                  orderItems={orderObj.orderItems} 
                  ordererDetails={orderObj.ordererDetails} 
                  orderId={orderObj.orderId}
                  merchantDetails={orderObj.merchantDetails}
                />
              )
            })

            : <Typography variant="h6">There is currently no unaccepted orders</Typography>

            }
        </div>

        <Typography variant="h4" sx={{mt: 3, mb: 2, display: "flex", justifyContent: "center"}}>Accepted Orders</Typography>

        <Stack direction="row" sx={{whiteSpace: "nowrap", overflowX: "auto", width: 1, py: 3, px: 2}}>
          {acceptedOrderList.length > 0 && acceptedOrderList.map(orderObj => (
            <AcceptedOrder 
              orderItems={orderObj.orderItems} 
              ordererDetails={orderObj.ordererDetails} 
              orderId={orderObj.orderId}
              merchantDetails={orderObj.merchantDetails}
            />
          ))}
        </Stack>

        <button onClick={() => navigate("addItem")}>Add Item</button>

        <Outlet />
      </>
    </>


  )
}