import { Box, Button, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material"
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ListIcon from '@mui/icons-material/List';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { acceptedOrderSliceActions } from "../../store/acceptedOrderSlice";
import { io } from 'socket.io-client'

export default function AcceptedOrder({ orderItems, ordererDetails, orderId, merchantDetails }) {
  const [isHovering, setIsHovering] = useState(false)
  const [socket, setSocket] = useState()
  const dispatch = useDispatch()
  const { orderList } = useSelector(state => state.acceptedOrder)

  useEffect(() => {
    const socket = io("http://localhost:5000") 
    setSocket(socket)

    socket.on('connect', () => console.log("Accepted order connected with socket"))
    socket.on('disconnect', () => console.log("Accepted order disconnected with socket"))


    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  const handleOrderReady = () => {
    // find the deliverer for this order (may not be assigned)
    const delivererName = orderList.find(orderObj => orderObj.orderId === orderId).deliverer

    if (delivererName) {
      socket.emit('order ready for collection', { orderItems, ordererDetails, orderId, merchantDetails, delivererName })
    } else {
      alert("There are no deliverers that have been assigned to this order")
    }

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
              <Button onClick={handleOrderReady}>Order is ready!</Button>
            </Box>
          }
            
          
        </Fragment>

      </Box>
    </Paper>
  )

};
