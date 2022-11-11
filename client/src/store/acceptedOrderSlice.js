import { createSlice } from "@reduxjs/toolkit";

export const acceptedOrderSlice = createSlice({
  name: "acceptedOrder",

  initialState: {
    // each order now has an additional field called deliverer: {ordererDetails: {name: __, address: __}, orderItems: [], 
    //   merchantDetails: {name: __, address: __}, orderId: ___ , deliverer: __}
    orderList: []
  },

  reducers: {
    addOrder(state, action) {
      state.orderList.push({ 
        ...action.payload,
        deliverer: "" // we will display this field for each acceptedOrder, once a deliverer has been confirmed for this order
      })
    },

    // need to check this
    assignDelivererToOrder(state, action) {
      // Look at unassignedDeliveriesSlice.js on how each order looks like. It is different from that in acceptedOrderSlice
      /* Remember, unlike unassignedDeliveriesSlice (for deliverer UI), the same order is split into different order items in acceptedOrderSlice
          based on merchants involved in the order, so we need to update each of these items*/ 
      // compare based on orderId
      const { delivererName, assignedOrder } = action.payload 
      state.orderList = state.orderList.map(order => {
        const { orderId } = order
        const { orderId: assignedOrderId } = assignedOrder

        if (orderId === assignedOrderId) {
          return {
            ...order,
            deliverer: delivererName
          }
        } else {
          return order
        }
      })
    },

    removeOrder(state, action) {
      // can remove more than 1 element
      const { orderId: orderIdToRemove } = action.payload
      state.orderList = state.orderList.filter(order => order.orderId !== orderIdToRemove)
    }
  }
})

export const acceptedOrderSliceActions = acceptedOrderSlice.actions
export default acceptedOrderSlice.reducer