import { createSlice } from "@reduxjs/toolkit";

export const userDetailsSlice = createSlice({
  name: "userDetails",

  initialState: {
    name: "",
    address: "",
  },

  reducers: {
    setUserDetails(state, action) {
      const { name, address } = action.payload
      state.name = name
      state.address = address
    },

    removeUserDetails(state) {
      state.name = ""
      state.address = ""
    }
  }
})

export const userDetailsSliceActions = userDetailsSlice.actions
export default userDetailsSlice.reducer