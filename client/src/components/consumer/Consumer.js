import Logout from "../others/Logout";
import { Fragment, useEffect, useState } from 'react'
import MerchantsInCategory from "./MerchantsInCategory";
import { Outlet, useLocation } from "react-router-dom";
import { AppBar, Avatar, Box, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Cart from "./Cart";
import io from 'socket.io-client'
const axios = require('axios')


export default function Consumer() {
  // Consumer has a cart as well as a list of all the restaurants that he can select to enter their store and see their items

  const [foodCategories, setFoodCategories] = useState()
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [socket, setSocket] = useState()
  const location = useLocation()
  const isAtConsumerHomePage = location.pathname === '/consumer'

  const toggleDrawer = () => {
    setIsCartDrawerOpen(!isCartDrawerOpen)
  }

  useEffect(() => {
    const socket = io("http://localhost:5000")
    setSocket(socket)

    socket.on('connect', () => console.log("Consumer connected to socket"))

    socket.on('disconnect', () => console.log("Consumer disconnected from socket"))

    socket.on('order rejection from server', (msg) => {
      console.log(msg)
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
      socket.off('connect')
      socket.off('disconnect')
      socket.off('order rejection')
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

    </Box>

      

  )
}