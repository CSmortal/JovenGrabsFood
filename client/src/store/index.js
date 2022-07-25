import { configureStore } from '@reduxjs/toolkit'
import { addFoodItemSlice } from './addFoodItemSlice'

const store = configureStore({
  reducer: {
    addFoodItem: addFoodItemSlice.reducer
  }
})

export default store