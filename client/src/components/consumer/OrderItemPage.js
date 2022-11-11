import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getItemDetails } from "../../store/dbActions";
import OrderItemSection from "./OrderItemSection";
import { FormControl, Box, Typography, Button, Container, Stack, IconButton } from "@mui/material";
import { cartSliceActions } from "../../store/cartSlice";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Shows all the information required to order this food item, such as sections, options, that can be selected to influence final price
export default function OrderItemPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const itemOrderDetails = useSelector(state => state.orderFoodItem)
  const { basicDetails, sectionDetails } = itemOrderDetails
  const { itemId } = useParams()
  const [itemOrderQty, setItemOrderQty] = useState(1)

  const handleSubmitForm = e => {
    e.preventDefault()
    dispatch(cartSliceActions.addItemToCart({ itemOrderDetails, itemOrderQty }))
    navigate(-2)
  }

  const handleDecrementQty = () => {
    if (itemOrderQty === 1) {
      return
    }
    setItemOrderQty(qty => --qty)
  }

  /*
    basicDetails: {
      merchantId: "",
      price: 0,
      name: "",
      imageUrl: ""
    },

    sectionDetails: { 
      // array of section objects
      // [{sectionName: __, options: [{description: __, priceChange: ___ , isSelected: ___}] }]
    },
  */

  useEffect(() => {
    dispatch(getItemDetails(itemId))
  }, [dispatch, itemId])

  let isSectionDetailsEmpty = Array.isArray(sectionDetails) && !sectionDetails.length


  return (
    <Box sx={{}}>
      <FormControl sx={{width: 1}}>
        {/* 1st part is the basic details like base price, and name of item */}
        <Box sx={{justifyContent: "space-around", display: "flex", mb: 2, mt: 3}}>
          <Typography variant="h4" component="div"><Box sx={{ fontWeight: 'bold' }}>{basicDetails.name}</Box></Typography>
          <Typography variant="h5" component="div">
            <Box sx={{ fontWeight: 'bold' }}>{parseFloat(basicDetails.price).toFixed(2)}</Box>
          </Typography>
        </Box>

        {!isSectionDetailsEmpty && sectionDetails.map(section => (
          <OrderItemSection 
            key={section.sectionName}
            section={section}
          />
          )
        )}
      </FormControl>
      
      <Box sx={{display: "flex", justifyContent: "space-around", px: 4, py: 4}}>
        <Button 
          variant="contained"
          sx={{p: 2, bgcolor: "success.main"}}
          onClick={e => handleSubmitForm(e)}
        >
          Add to basket
        </Button>

        <Stack direction="row" sx={{alignItems: "center"}}>
          <IconButton onClick={handleDecrementQty}>
            <RemoveIcon />
          </IconButton>

          <Typography variant="h5" sx={{px: 1}}>{itemOrderQty}</Typography>

          <IconButton onClick={() => setItemOrderQty(qty => ++qty)}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>

  )
}