import { createSlice, current } from "@reduxjs/toolkit";

export const orderFoodItemSlice = createSlice({
  name: "orderFoodItem",

  initialState: {
    basicDetails: {
      merchantId: "",
      price: 0,
      name: "",
      imageUrl: ""
    },

    sectionDetails: [
      // array of section objects
      // [{sectionName: __, options: [{description: __, priceChange: ___ , isSelected: ___}] }]
    ],


    netPrice: "" // the price after taking into account selected options
  },
  
  reducers: {

    setBasicDetails(state, action) {
      const { user_id:merchantId, item_price:price, item_name:name, item_image_url:imageUrl } = action.payload

      state.basicDetails = {
        merchantId,
        price,
        name,
        imageUrl
      }

      state.netPrice = price
    },

    setSectionDetails(state, action) {
      let myArr = []
      action.payload.forEach(sectionObj => {

        let index = myArr.findIndex(ele => ele.sectionName === sectionObj.item_section_name)
        let isSectionDetailInMyArr = index !== -1

        if (isSectionDetailInMyArr) {
          const newOption = {
            description: sectionObj.option_description,
            priceChange: sectionObj.option_price_change,
            isSelected: false
          }

          myArr[index].options.push(newOption)

        } else {

          const newSectionDetail = {
            sectionName: sectionObj.item_section_name,
            options: [
              {
                description: sectionObj.option_description,
                priceChange: sectionObj.option_price_change,
                isSelected: false
              }
            ]
          }

          myArr.push(newSectionDetail)
        }
      })

      state.sectionDetails = myArr
    },

    setOptionChecked(state, action) {
      
      const { sectionName, optionDescription } = action.payload
      // console.log("Here")
      // console.log(optionDescription)

      const sIndex = state.sectionDetails.findIndex(sectionObj => sectionObj.sectionName === sectionName)
      const oIndex = state.sectionDetails[sIndex].options
              .findIndex(optionObj => optionObj.description === optionDescription)

      // clear all isSelected in this section
      state.sectionDetails[sIndex].options = state.sectionDetails[sIndex].options.map(option => {
        return {...option, isSelected: false}
      })

      
      const optionSelected = state.sectionDetails[sIndex].options[oIndex]
      const statusOfSelection = optionSelected.isSelected // curr status before toggling
      const priceChangeOfOption = optionSelected.priceChange

      state.sectionDetails[sIndex].options[oIndex].isSelected = !statusOfSelection // toggle

      // change net price upon checking or unchecking of option
      if (statusOfSelection === true) {
        // then toggling it means the option is unchecked
        state.netPrice = state.basicDetails.price - priceChangeOfOption
      } else {
        state.netPrice = state.basicDetails.price + priceChangeOfOption
      }
       
    },


  }
})

export const orderFoodItemActions = orderFoodItemSlice.actions
export default orderFoodItemSlice.reducer
