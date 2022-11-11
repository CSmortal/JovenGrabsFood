import Logout from "../others/Logout";
import { Fragment, useEffect, useState } from 'react'
import { AppBar, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Toolbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { io } from 'socket.io-client'
import { unassignedDeliveriesSliceActions } from "../../store/unassignedDeliveriesSlice";
import UnassignedOrder from "./UnassignedOrder";
import AssignedOrder from "./AssignedOrder";

export default function Deliverer() {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [orderToCollect, setOrderToCollect] = useState()
  const [ socket, setSocket ] = useState()


  const dispatch = useDispatch()
  const { unassignedOrderList } = useSelector(state => state.unassignedDeliveries)
  const { assignedOrderList } = useSelector(state => state.assignedDeliveries)
  const { orderList: acceptedOrderList } = useSelector(state => state.acceptedOrder) 

  useEffect(() => {
    const socket = io("http://localhost:5000")
    setSocket(socket)

    socket.on('notify deliverers of new order', (orderInfo) => {
      // add to redux state
      console.log("Deliverer notified: " + JSON.stringify(orderInfo))
      dispatch(unassignedDeliveriesSliceActions.addUnassignedOrder(orderInfo))
    })

    socket.on('notify deliverer of order ready for collection', (orderInfo) => {
      // we want a dialog to appear and also for the correct assigned order to stand out visibly (using color or maybe animation)
      setIsCollectionDialogOpen(true)
      setOrderToCollect(orderInfo)
    })


    socket.emit('delivererToServer', localStorage.getItem("userName"))

    return () => {
      socket.off('notify deliverers of new order')
      socket.off('notify deliverer of order ready for collection')
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
        <Typography variant="h3">Deliverer</Typography>

        <Logout />

        <Typography variant="h4" sx={{mt: 3, mb: 2, display: "flex", justifyContent: "center"}}>Unassigned Orders</Typography>

        <Stack sx={{display: "flex", whiteSpace: "nowrap", overflowX: "auto", width: 1, py: 3, px: 2}}>
          {/*For unassigned deliveries*/}
          {/* Since we can have the same order split up into different elements based on merchant, we need to
          gather them back into one element for the sake of the deliverers who might pick them. This is already done in redux store */}

          {unassignedOrderList.length > 0 && unassignedOrderList.map(unassignedOrder => (
            <UnassignedOrder order={unassignedOrder}/>
          ))}
        </Stack>

        <Typography variant="h4" sx={{mt: 3, mb: 2, display: "flex", justifyContent: "center"}}>My Orders</Typography>

        <Stack sx={{display: "flex", whiteSpace: "nowrap", overflowX: "auto", width: 1, py: 3, px: 2}}>
          {/*For deliveries that this deliverer has accepted to do*/}
          
          {assignedOrderList.length > 0 && assignedOrderList.map(assignedOrder => (
            <AssignedOrder order={assignedOrder}/>
          ))}
        </Stack>
      </>
      
      {orderToCollect && 
        <Dialog open={isCollectionDialogOpen} onClose={() => setIsCollectionDialogOpen(false)}>
          <DialogTitle>{`Order #${orderToCollect.orderId} is ready for collection!`}</DialogTitle>

          <DialogContent>
            <DialogContentText>
              {`Please collect the order from ${orderToCollect.merchantDetails.name} at ${orderToCollect.merchantDetails.address}, and then
              click the "Order collected" button under this order at the "My Orders" section`}
            </DialogContentText>

            <DialogActions>
              <Button onClick={() => setIsCollectionDialogOpen(false)}>Ok</Button>
            </DialogActions>
          </DialogContent>

        </Dialog>
      }

    </>


  )
}