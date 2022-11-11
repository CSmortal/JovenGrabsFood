import { Box, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { io } from 'socket.io-client'
import { useDispatch } from "react-redux";
import { acceptedOrderSliceActions } from "../../store/acceptedOrderSlice";
import { blue, red } from "@mui/material/colors";


export default function AssignedOrder({ order }) {
  const [isHovering, setIsHovering] = useState(false)
  const [socket, setSocket] = useState()
  const [isCollected, setIsCollected] = useState(false)
  const dispatch = useDispatch()

  // we want to restructure order to be like [ {merchantName: ___, merchantAddress: ___, items: []} ]
  const { orderId, orderItems, merchantDetails } = order
  const orderItemsByMerchantArr = []

  // this should be called when irl, the deliverer has collected from all merchants involved in the order
  const handleOrderCollected = () => {
    // notify the consumer who ordered that the order is coming
    socket.emit('deliverer collected order', order)
    // edit this order from assignedDeliverySlice to update deliverer UI, i.e change the background color and remove the button (only
    // when the consumer has clicked on the order at their side, then will this AssignedOrder component be removed)
    setIsCollected(true)
    // remove this order from acceptedOrderSlice to update merchant UI
    dispatch(acceptedOrderSliceActions.removeOrder(order)) 
    // 
  }

  const handleOrderDelivered = () => {
    if (!isCollected) {
      return
    }

    socket.emit('deliverer delivered order', order)
  }

  useEffect(() => {
    const socket = io('http://localhost:5000')

    setSocket(socket)

    socket.on()

  }, [])

  orderItems.forEach(orderItem => {
    const merchantSellingThisItem = orderItem.basicDetails.merchantName
    const index = orderItemsByMerchantArr.findIndex(item => item.merchantName === merchantSellingThisItem)

    if (index !== -1) {
      orderItemsByMerchantArr[index].items.push(orderItem)
    } else {
      console.log("merchantDetails: " + JSON.stringify(merchantDetails))
      const merchantAddress = merchantDetails.find(detail => detail.name === merchantSellingThisItem).address

      orderItemsByMerchantArr.push({
        merchantName: merchantSellingThisItem,
        merchantAddress,
        items: [orderItem]
      })
    }
  })

  console.log("orderItemsByMerchantArr: " + JSON.stringify(orderItemsByMerchantArr))

  return (
    // Make a nested list that is by default closed, for each item under each merchant
    <Paper 
      elevation={2} 
      sx={{my: 4, mx: 2, bgcolor: isCollected ? red[500] : blue[200], width: 400, height: 300, overflowY: 'auto'}}
    >
      <Box
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleOrderDelivered}
      >

        <Fragment>
          {/*  */}
          <Typography variant="h3">{`Order ID: ${orderId}`}</Typography>
          {orderItemsByMerchantArr.map(merchantItemsObj => {
            // merchantItemsObj represents all items in the order from this merchant, and contains merchant details
            const { merchantName, merchantAddress, items } = merchantItemsObj
            return (
              <>
                <List subheader={`${merchantName} - ${merchantAddress}`}>
                  {items.map(item => {
                    return (
                      <ListItem divider>
                        <ListItemIcon>
                          <RestaurantIcon />
                        </ListItemIcon>
                        <ListItemText primary={item.basicDetails.name}/>
                      </ListItem>
                    )
                  })}
                </List>

                <Divider variant="middle"/>
              </>

            )
          })}

          {isHovering && !isCollected &&
            <Box position="sticky" bottom="0" display="flex" justifyContent="end">
              <Button
                variant="contained"
                color="success.light"
                onClick={handleOrderCollected}
              >Order collected</Button>
            </Box>
          }
        </Fragment>

      </Box>
    </Paper>
  )
};
