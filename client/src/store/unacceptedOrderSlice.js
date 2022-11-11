import { createSlice } from "@reduxjs/toolkit";

export const unacceptedOrderSlice = createSlice({
  name: "unacceptedOrder",

  initialState: {
    orderList: [] // Will be array of order objects, where each object looks like 
    // { ordererDetails: {name: __, address: __}, orderItems: [], orderId: __, merchantDetails: {name: __, address: ___}}. See index.js for server 
    // If there are items bought from different merchant in same order, they will be separate elements in this orderList
  },

  reducers: {
    addOrder(state, action) {
      state.orderList.push(action.payload)
    },

    removeOrder(state, action) {
      
      state.orderList = state.orderList.filter(order => {
        return order.orderId !== action.payload.orderId
      })
    }
  }
})

export const unacceptedOrderSliceActions = unacceptedOrderSlice.actions
export default unacceptedOrderSlice.reducer