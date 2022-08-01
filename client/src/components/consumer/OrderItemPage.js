import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getItemDetails } from "../../store/dbActions";
import OrderItemSection from "./OrderItemSection";
import { FormControl, Box, Typography, Button } from "@mui/material";

// Shows all the information required to order this food item, such as sections, options, that can be selected to influence final price
export default function OrderItemPage() {
  const dispatch = useDispatch()
  const { basicDetails, sectionDetails } = useSelector(state => state.orderFoodItem)
  const { itemId } = useParams()

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
    <>
      
      <FormControl sx={{width: 1, px: 10}}>
        {/* 1st part is the basic details like base price, and name of item */}
        <Box sx={{justifyContent: "space-around", display: "flex", mb: 2}}>
          <Typography variant="h5">{basicDetails.name}</Typography>
          <Typography variant="h5">{basicDetails.price}</Typography>
        </Box>

        {!isSectionDetailsEmpty && sectionDetails.map(section => (
          <OrderItemSection 
            key={section.sectionName}
            section={section}
          />
          )
        )}
      </FormControl>
      
      <Button variant="contained">Add to basket</Button>
    </>

  )
}