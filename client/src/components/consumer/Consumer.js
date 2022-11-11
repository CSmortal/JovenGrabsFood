import Logout from "../others/Logout";
import { Fragment, useEffect, useState } from 'react'
import MerchantsInCategory from "./MerchantsInCategory";
import { Outlet, useLocation } from "react-router-dom";
import { AppBar, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Cart from "./Cart";
import io from 'socket.io-client'
const axios = require('axios')


export default function Consumer() {
  // Consumer has a cart as well as a list of all the restaurants that he can select to enter their store and see their items

  const [foodCategories, setFoodCategories] = useState()
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [hasMadeOrder, setHasMadeOrder] = useState(false)
  const [orderStatusMsg, setOrderStatusMsg] = useState("")
  const [socket, setSocket] = useState()

  const location = useLocation()
  const isAtConsumerHomePage = location.pathname === '/consumer'

  const toggleDrawer = () => {
    setIsCartDrawerOpen(!isCartDrawerOpen)
  }

  useEffect(() => {
    const socket = io("http://localhost:5000")
    setSocket(socket)

    // socket.on('connect', () => console.log("Consumer connected to socket"))

    // socket.on('disconnect', () => console.log("Consumer disconnected from socket"))

    socket.on('notify consumer of accepted order', (order) => {
      setHasMadeOrder(true)
      setOrderStatusMsg("Your order has been accepted.")
    })

    socket.on('order rejection from server', (msg) => {
      console.log(msg)
    })

    socket.on('notify consumer of order collection by deliverer', () => {
      setIsCollectionDialogOpen(true)
      setOrderStatusMsg("Your order has been collected by deliverer.")
    })

    socket.on('notify consumer that order has been delivered', () => {
      setOrderStatusMsg("Your order has been delivered")
      // open some kind of dialog to notify user
      setIsDeliveryDialogOpen(true)
    })

    socket.emit('consumerToServer', localStorage.getItem("userName"))
    
    const getFoodCategoriesFromDb = async () => {
      const response = await axios.get("http://localhost:5000/db/food-categories").then(res => res.data)
      return response
    }

    try {
      getFoodCategoriesFromDb().then(res => setFoodCategories(res))
    } catch (error) {
      console.error(error.message)
    }

    return () => {
      // socket.off('connect')
      // socket.off('disconnect')
      socket.off('order rejection')
      socket.off('notify consumer of order collection by deliverer')
      socket.off('notify consumer that order has been delivered')
      socket.off('notify consumer of accepted order')
    }
  }, [])


  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar sx={{justifyContent: "space-between"}}>

          <Typography variant="h5">JovenGrabsFood</Typography>

          <Box display="flex">
            <IconButton onClick={toggleDrawer}>
              <ShoppingCartOutlinedIcon />
            </IconButton>

            <Avatar>{localStorage.getItem("userName")}</Avatar>
          </Box>

        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isCartDrawerOpen} onClose={toggleDrawer}>
        <Cart toggleDrawer={toggleDrawer}/>
      </Drawer>

      <Logout />
      {/* We will add a cart feature to the navbar later */}


      <Outlet />


      
      {foodCategories && isAtConsumerHomePage && foodCategories.map(category => {
        return (
          <div key={category}>
            <h2 className="categoryName">{category}</h2>
            <MerchantsInCategory category={category} />
          </div>

        )
      })}

      {hasMadeOrder &&
        <Stack sx={{position: "fixed", bottom: 100}}>
          <Typography variant="h5">{orderStatusMsg}</Typography>
        </Stack>
      }


      <Dialog open={isCollectionDialogOpen} onClose={() => setIsCollectionDialogOpen(false)}>
        <DialogTitle>Your Order is on its way!</DialogTitle>

        <DialogContent>
          <DialogContentText>
            We're hungry too, but please don't forget to acknowledge that you have received the food!
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsCollectionDialogOpen(false)}>I'm ready!</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={isDeliveryDialogOpen} onClose={() => setIsDeliveryDialogOpen(false)}>
        <DialogTitle>Your order has arrived!</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Thank you for using JovenGrabsFood! Enjoy your meal!
          </DialogContentText>

          <DialogActions>
            <Button onClick={() => setIsDeliveryDialogOpen(false)}>Ok</Button>
          </DialogActions>

        </DialogContent>
      </Dialog>

    </Box>

      

  )
}