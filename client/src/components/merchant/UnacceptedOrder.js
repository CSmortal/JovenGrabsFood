import { Box, Button, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material"
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ListIcon from '@mui/icons-material/List';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Fragment, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { unacceptedOrderSliceActions } from "../../store/unacceptedOrderSlice";
import { acceptedOrderSliceActions } from "../../store/acceptedOrderSlice";
import { io } from 'socket.io-client'

export default function UnacceptedOrder({ orderItems, ordererDetails, orderId, merchantDetails }) {
  const [isHovering, setIsHovering] = useState(false)
  const [socket, setSocket] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = io("http://localhost:5000") 
    setSocket(socket)

    socket.on('connect', () => console.log("Unaccepted order connected with socket"))
    socket.on('disconnect', () => console.log("Unaccepted order disconnected with socket"))


    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  const handleAcceptOrder = () => {
    // Move the order to accepted order list, and notify all deliverers
    dispatch(unacceptedOrderSliceActions.removeOrder({orderItems, ordererDetails, orderId, merchantDetails}))
    dispatch(acceptedOrderSliceActions.addOrder({orderItems, ordererDetails, orderId, merchantDetails}))
    console.log("Orderer Details: " + JSON.stringify(ordererDetails))
    socket.emit('order accepted', orderItems, ordererDetails, orderId, merchantDetails)
  }

  const handleRejectOrder = () => {
    // notify consumer who ordered this item of the rejection
    dispatch(unacceptedOrderSliceActions.removeOrder({orderItems, ordererDetails, orderId, merchantDetails}))
    socket.emit('order rejected', orderItems, ordererDetails, orderId)
    console.log("Orderer Details: " + JSON.stringify(ordererDetails))
  }

  return (

    <Paper elevation={2} sx={{my: 4, mx: 2, width: 400, height: 300, overflowY: 'auto'}}>
      <Box 
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
        
      >
        <Fragment>
          {orderItems.map(itemOrdered => {
              return (
                <List>
                  <ListItemText primary={`Order #${orderId}`} sx={{fontWeight: "md", fontSize: "lg", px: 1}}/>
                  <ListItemText primary={itemOrdered.basicDetails.name} sx={{fontWeight: "sm", fontSize: "md", px: 1}}/>

                  <Collapse in={true}>
                    {itemOrdered.sectionDetails.map(section => {
                      return (
                        <List>
                        {/* One List per section for this item */}
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <ListIcon />
                            </ListItemIcon>

                            <ListItemText primary={section.sectionName}/>
                          </ListItem>

                        
                          <ListItem sx={{ pl: 4 }}>
                            <Collapse in={true}>
                              <List disablePadding>
                                {section.options.filter(option => option.isSelected).map(selectedOption => {
                                  return (
                                    <ListItem sx={{ pl: 4 }}>
                                      <ListItemIcon>
                                          <CheckBoxIcon />
                                      </ListItemIcon>

                                      <ListItemText primary={selectedOption.description}/>
                                    </ListItem>
                                  )
                                })}
                              </List>
                            </Collapse>

                          </ListItem>

                        </List>
                      )
                    })}

                  </Collapse>
                </List>
              )          
          })}

          {isHovering && 
            <Box position="sticky" bottom="0" display="flex" justifyContent="end">
              <Button 
                variant="contained"
                // color="success.light" 
                onClick={handleAcceptOrder}
              >Accept</Button>

              <Button 
                variant="contained" 
                onClick={handleRejectOrder}
              >Reject</Button>
            </Box>
          }
            
          
        </Fragment>

      </Box>
    </Paper>
  )
};