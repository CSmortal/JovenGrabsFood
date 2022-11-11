import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unassignedDeliveriesSliceActions } from "../../store/unassignedDeliveriesSlice";
import { acceptedOrderSliceActions } from "../../store/acceptedOrderSlice"
import { io } from "socket.io-client";
import { assignedDeliveriesSliceActions } from "../../store/assignedDeliveriesSlice";

export default function UnassignedOrder({ order }) {
  // see unassignedDeliveriesSlice.js on how each element looks like, not unacceptedOrderSlice.js
  /* We only want to show address of consumer, merchantName, merchant address
      and item name(s) (without any section and options details)*/
  // lets exclude item name for now
  const [isHovering, setIsHovering] = useState(false)
  const [socket, setSocket] = useState()
  const delivererDetails = useSelector(state => state.userDetails)
  const { ordererDetails, merchantDetails } = order
  const dispatch = useDispatch()
  let counter = 1


  const handleOrderAssigned = () => {
    // remove this order from unassigned order list in redux
    dispatch(unassignedDeliveriesSliceActions.removeUnassignedOrder(order))
    // need to emit to server an event that will tell all other deliverers that they should update their unassigned order list in redux
    socket.emit('order assigned to a deliverer', order)
    // need to update acceptedOrderSlice since there is a field called "deliverer", which is used to update Merchant UI
    dispatch(acceptedOrderSliceActions.assignDelivererToOrder({
      delivererName: delivererDetails.name,
      assignedOrder: order,
    }))
    // add this order to assigned order list in redux
    dispatch(assignedDeliveriesSliceActions.addAssignedOrder({
      delivererName: delivererDetails.name,
      assignedOrder: order,
    }))
  }

  console.log("Merchant details: " + JSON.stringify(merchantDetails))

  useEffect(() => {
    const socket = io("http://localhost:5000")
    setSocket(socket)
    
    socket.on('order already assigned to another deliverer', (assignedOrder) => {
      dispatch(unassignedDeliveriesSliceActions.removeUnassignedOrder(assignedOrder))
    })

    return () => {
      socket.off('order already assigned to another deliverer')
    }
  }, [order])

  return (
    <Paper elevation={2} sx={{my: 4, mx: 2, width: 400, height: 200, overflowY: 'auto'}}>
      <Box
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
      >
        <>
          <List>
            <ListItem divider={true}>
              <ListItemIcon>
                <DeliveryDiningIcon />
              </ListItemIcon>

              <ListItemText primary={`Deliver to: ${ordererDetails.address}`} />
            </ListItem>

            {merchantDetails.map(merchantDetail => {
              console.log(JSON.stringify(merchantDetail))
              return (
                <ListItem key={counter++}>
                  <ListItemIcon>
                    <RestaurantIcon />
                  </ListItemIcon>

                  <ListItemText primary={`${merchantDetail.name} - ${merchantDetail.address}`}/>
                </ListItem>
              )
            })}

          </List>
          
          {isHovering &&
            <Box position="sticky" bottom="0" justifyContent="end">
              <Button 
                variant="contained"
                onClick={handleOrderAssigned}
              >Deliver</Button>
            </Box>
          }

        </>

      </Box>
    </Paper>

  )
};
