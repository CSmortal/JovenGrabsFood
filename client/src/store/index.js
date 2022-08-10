import { configureStore } from '@reduxjs/toolkit'
import addFoodItemReducer, { addFoodItemSlice } from './addFoodItemSlice'
import merchantItemsReducer, { merchantItemsSlice } from './merchantItemsSlice'
import orderFoodItemReducer, { orderFoodItemSlice } from './orderFoodItemSlice'
import cartReducer, { cartSlice } from './cartSlice'
import unacceptedOrderReducer, { unacceptedOrderSlice } from './unacceptedOrderSlice'
import acceptedOrderReducer, { acceptedOrderSlice } from './acceptedOrderSlice'

const store = configureStore({
  reducer: {
    addFoodItem: addFoodItemReducer,
    merchantItems: merchantItemsReducer,
    orderFoodItem: orderFoodItemReducer,
    cart: cartReducer,
    unacceptedOrder: unacceptedOrderReducer,
    acceptedOrder: acceptedOrderReducer,
  }
})

export default store