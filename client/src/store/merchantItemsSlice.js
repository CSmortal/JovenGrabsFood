import { createSlice } from "@reduxjs/toolkit";

export const merchantItemsSlice = createSlice({
  name: "merchantItems",

  initialState: {
    itemsList: []
  },

  reducers: {
    setItemsList(state, action) {
      state.itemsList = action.payload
    },
  }
})

export const merchantItemsActions = merchantItemsSlice.actions
export default merchantItemsSlice.reducer