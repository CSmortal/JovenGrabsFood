import { useDispatch, useSelector } from "react-redux";
import { Stack, Box, Typography, Divider, styled, IconButton, Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { cartSliceActions } from "../../store/cartSlice";
import { io } from 'socket.io-client'


const QtyEditor = styled(Stack)({
  direction: "row",
  alignItems: "center"
})

export default function Cart({ toggleDrawer }) {
  const { itemsList, totalNetPrice } = useSelector(state => state.cart)
  const [ socket, setSocket ] = useState(null)
  const dispatch = useDispatch()
  let boxCounter = 1
  let typoCounter = 1

  useEffect(() => {
    const socket = io("http://localhost:5000")
    setSocket(socket)

    socket.on('connect', () => {
      console.log("Cart connected to server socket")
    })

    socket.on('disconnect', () => {
      console.log("Cart disconnected from server socket")
    })

    // socket.on('send order', msg => {console.log(msg)})

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('send order')
    }

  }, [])

  const handleCheckout = () => {
    socket.emit('order', itemsList, localStorage.getItem("userName")) // need to send both itemsList as well as the consumer's name (the one who made this order)
    dispatch(cartSliceActions.clearCart())
  }


  return (
    <>
      <Typography variant="h4" px={4} pt={4} mx={5}>Your Cart</Typography>

      <Stack spacing={2}>
        {itemsList.length > 0 && itemsList.map(item => {
          return (
            <Box display="flex" justifyContent="space-around" alignItems="center" key={boxCounter++} p={2}>
              {/* The qty counter and its buttons */}
              <QtyEditor>
                <IconButton onClick={() => dispatch(cartSliceActions.decrementItemQty(item))}>
                  <RemoveIcon />
                </IconButton>

                <Typography variant="h5" sx={{px: 1}}>{item.quantity}</Typography>

                <IconButton onClick={() => dispatch(cartSliceActions.incrementItemQty(item))}>
                  <AddIcon />
                </IconButton>
              </QtyEditor>

              <Typography variant="h6">{item.basicDetails.name}</Typography>

              <Stack>
                {/* List out the checked options for this item here */}
                {item.sectionDetails.map(section => {
                  return section.options.map(option => {
                    if (option.isSelected) {
                      return <Typography variant="body2" key={typoCounter++}>{option.description}</Typography>
                    } else {
                      return "" // might cause issue
                    }
                  })
                })}
              </Stack>

              <Typography variant="h6">{item.netItemCost * item.quantity}</Typography>
            </Box>
          )})
        }

        <Divider></Divider>

        <Stack spacing={2} alignItems="">
          {/* component for total cost */}
          <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
            <Typography variant="h5">Total</Typography>
            <Typography>{totalNetPrice}</Typography>
          </Box>

          {/* button to  */}
          <Button 
            onClick={() => {
              handleCheckout()
              toggleDrawer()
            }}
            variant="contained"
            // color="success.light"
          >
            Checkout
          </Button>
        </Stack>


      </Stack>
    </>

  )
}