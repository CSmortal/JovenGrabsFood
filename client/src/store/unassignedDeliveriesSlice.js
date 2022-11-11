import { createSlice } from "@reduxjs/toolkit";

export const unassignedDeliveriesSlice = createSlice({
  name: "unassignedDeliveries",

  initialState: {
    unassignedOrderList: [], // each element looks like 
    // {orderId: ___, orderItems: [], ordererDetails: {name: __, address: __}, merchantDetails: [{name: __, address: ___}] }
    // unlike unacceptedOrderSlice, we have a unique object here for every unique order id (an order with multiple merchants will not
    // be separated into different objects)
  },
    
  reducers: {
    addUnassignedOrder(state, action) {
      // action.payload looks like { ordererDetails: {name: __, address: __}, orderItems: [], orderId: __, merchantDetails: {name: __, address: ___}}
      // each element in orderItems is an item object. See cartSlice.js on what it looks like. So orderItems is an array of item obj
      const { orderItems: newOrderItems, ordererDetails, merchantDetails: newMerchantDetails, orderId } = action.payload
      const relevantOrder = state.unassignedOrderList.find(unassignedOrder => unassignedOrder.orderId === orderId)

      if (relevantOrder) {

        state.unassignedOrderList = state.unassignedOrderList.map(unassignedOrder => {
          if (unassignedOrder.orderId === orderId) {
            const { updatedMerchantDetails, updatedOrderItems } = unassignedOrder

            newOrderItems.forEach(newItem => updatedOrderItems.push(newItem))

            console.log(JSON.stringify(updatedOrderItems))

            if (!updatedMerchantDetails.find(detailObj => 
                    JSON.stringify(detailObj) === JSON.stringify(newMerchantDetails))) {

                updatedMerchantDetails.push(newMerchantDetails)
            }
            return { 
              orderId,
              orderItems: updatedOrderItems,
              ordererDetails,
              merchantDetails: updatedMerchantDetails 
            }

          } else {
            return unassignedOrder
          }

        })

      } else {
        // push in a new order with an id that is UNIQUE among the current unassigned orders
        state.unassignedOrderList.push({
          orderId,
          orderItems: newOrderItems,
          ordererDetails,
          merchantDetails: [newMerchantDetails], // array of objects that looks like {name: ___, address: __ }
        })
      }
    },

    removeUnassignedOrder(state, action) {
      state.unassignedOrderList = state.unassignedOrderList.filter(unassignedOrder => {
        return unassignedOrder.orderId !== action.payload.orderId
      })
    }
  }

})

export const unassignedDeliveriesSliceActions = unassignedDeliveriesSlice.actions
export default unassignedDeliveriesSlice.reducer