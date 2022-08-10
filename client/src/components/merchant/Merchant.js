import Logout from "../others/Logout";
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import UnacceptedOrder from "./UnacceptedOrder";
import { useDispatch, useSelector } from "react-redux";
import { unacceptedOrderSliceActions } from "../../store/unacceptedOrderSlice";
import AcceptedOrder from "./AcceptedOrder";


export default function Merchant() {
  const navigate = useNavigate()
  const [socket, setSocket] = useState()
  let counter = 1
  const dispatch = useDispatch()
  const { orderList: unacceptedOrderList } = useSelector(state => state.unacceptedOrder)
  const { orderList: acceptedOrderList } = useSelector(state => state.acceptedOrder) 


  useEffect(() => {
    const socket = io("http://localhost:5000")

    setSocket(socket)

    socket.on('connect', () => {
      console.log("Merchant connected to server socket")
    })

    socket.on('disconnect', () => {
      console.log("Merchant disconnected from server socket")
    })

    socket.on("send order", ({ nameOfOrderer, items }) => {
      // setUnacceptedOrders(currArr => {
      //   let newArr = [...currArr] // if this step is not done, this component will NOT rerender
      //   newArr.push(itemsInOrder)
      //   return newArr
      // })
      dispatch(unacceptedOrderSliceActions.addOrder({nameOfOrderer, items}))
    })

    // for each merchant, we want to store this socket on server side in an array, and make it join a room
    socket.emit('merchantToServer', localStorage.getItem("userName"))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }

  }, [dispatch])
  

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

        <div className="unacceptedOrders">
          {unacceptedOrderList.length > 0 && unacceptedOrderList.map(orderObj => (
            <UnacceptedOrder order={orderObj.items} ordererName={orderObj.nameOfOrderer}/>
          ))}
        </div>

        <Stack sx={{display: "flex", whiteSpace: "nowrap", overflowX: "auto", width: 1, py: 3, px: 2}}>
          {acceptedOrderList.length > 0 && acceptedOrderList.map(orderObj => (
            <AcceptedOrder order={orderObj.items} />
          ))}
        </Stack>

        <button onClick={() => navigate("addItem")}>Add Item</button>

        <Outlet />
      </>
    </>


  )
}