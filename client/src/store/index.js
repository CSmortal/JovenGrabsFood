import { configureStore } from '@reduxjs/toolkit'
import addFoodItemReducer, { addFoodItemSlice } from './addFoodItemSlice'
import merchantItemsReducer, { merchantItemsSlice } from './merchantItemsSlice'
import orderFoodItemReducer, { orderFoodItemSlice } from './orderFoodItemSlice'

const store = configureStore({
  reducer: {
    addFoodItem: addFoodItemReducer,
    merchantItems: merchantItemsReducer,
    orderFoodItem: orderFoodItemReducer,
  }
})

export default store