import { createSlice } from "@reduxjs/toolkit";
import { checkCartItemDataEquality } from "../utils";

export const cartSlice = createSlice({
  name: "cart",

  initialState: {
    itemsList: [], //
    totalNetPrice: 0
  },

  // An item looks like 
  /* 
  {
    basicDetails: {
      merchantName: "",
      price: 0,
      name: "",
      imageUrl: ""
    },

    sectionDetails: { 
      // array of section objects
      // [{sectionName: __, options: [{description: __, priceChange: ___ , isSelected: ___}] }]
    },

    netItemCost: (float), !!! IMPORTANT => ignores the quantity!

    quantity: (integer),
  }
  */

  reducers: {
    addItemToCart(state, action) {
      const { itemOrderDetails, itemOrderQty } = action.payload
      const { basicDetails, sectionDetails } = itemOrderDetails

      // edit netPrice
      let netItemCost = parseFloat(basicDetails.price)

      sectionDetails.forEach(section => {
        section.options.forEach(option => {
          if (option.isSelected) {
            netItemCost += parseFloat(option.priceChange)
          }
        })
      })

      const fullItemInfo = { basicDetails, sectionDetails, netItemCost, quantity: itemOrderQty }
      state.itemsList.push(fullItemInfo)

      state.totalNetPrice += netItemCost * itemOrderQty
    },

    clearCart(state) {
      state.itemsList = []
      state.totalNetPrice = 0
    },

    decrementItemQty(state, action) {
      const itemEdited = action.payload
      state.itemsList = state.itemsList.map(itemInStore => {
        if (checkCartItemDataEquality(itemEdited, itemInStore)) {
          console.log(typeof itemInStore.netItemCost)
          state.totalNetPrice -= itemInStore.netItemCost

          if (itemInStore.quantity === 1) {
            // we choose to remove the item from the cart for now
            return ""
          }
          const editedItemInStore = { 
            ...itemInStore,
            quantity: --itemInStore.quantity 
          }
          return editedItemInStore
        } else {
          return itemInStore
        }
      })
      
      state.itemsList = state.itemsList.filter(item => item !== "")

      console.log(state.itemsList)
    }, 


    incrementItemQty(state, action) {
      const itemEdited = action.payload
      state.itemsList = state.itemsList.map(itemInStore => {
        if (checkCartItemDataEquality(itemEdited, itemInStore)) {
          state.totalNetPrice += itemInStore.netItemCost

          const editedItemInStore = { 
            ...itemInStore,
            quantity: ++itemInStore.quantity 
          }
          return editedItemInStore
          
        } else {
          return itemInStore
        }
      })
    }
  }
})

export const cartSliceActions = cartSlice.actions
export default cartSlice.reducer