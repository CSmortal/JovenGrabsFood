import Logout from "../others/Logout";
import { Fragment } from 'react'
import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function Deliverer() {
  const { orderList: acceptedOrderList } = useSelector(state => state.acceptedOrder) 

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

        <Stack sx={{display: "flex", whiteSpace: "nowrap", overflowX: "auto", width: 1, py: 3, px: 2}}>
          {/* each accepted order can be hovered, and then theres a button to choose to deliver the order */}
          {acceptedOrderList.length > 0 && acceptedOrderList.map(orderObj => (
            
          ))}
        </Stack>

        <button onClick={() => navigate("addItem")}>Add Item</button>

        <Outlet />
      </>
    </>


  )
}