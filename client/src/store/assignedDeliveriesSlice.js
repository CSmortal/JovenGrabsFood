import { createSlice } from "@reduxjs/toolkit";

export const assignedDeliveriesSlice = createSlice({
  name: "assignedDeliveries",

  initialState: {
    assignedOrderList: [] 
    // looks exactly like the one in unassignedDeliveriesSlice, with one additional field called "deliverer"
  },

  reducers: {
    addAssignedOrder(state, action) {
      const { assignedOrder, delivererName } = action.payload
      state.assignedOrderList.push({
        ...assignedOrder,
        deliverer: delivererName
      })
    }
  }
})

export const assignedDeliveriesSliceActions = assignedDeliveriesSlice.actions
export default assignedDeliveriesSlice.reducer