import { merchantItemsActions } from './merchantItemsSlice'
import { orderFoodItemActions } from './orderFoodItemSlice'
const axios = require('axios')


export const getAllItemsFromMerchant = (merchantName) => {
  return async (dispatch) => {
    
    const fetchData = async () => {
      return await axios.get(`http://localhost:5000/db/all-merchant-items/${merchantName}`)
          .then(res => res.data)
    }

    try {
      const data = await fetchData()
      dispatch(merchantItemsActions.setItemsList(data))

    } catch (error) {
      console.error(error.message)
    }
  }
}

export const getItemDetails = (itemId) => {
  return async (dispatch) => {

    const fetchData = async () => {
      return await axios.get(`http://localhost:5000/db/itemDetails/${itemId}`).then(res => res.data)
    }

    try {
      const data = await fetchData()

      dispatch(orderFoodItemActions.setBasicDetails(data.basicDetails))
      dispatch(orderFoodItemActions.setSectionDetails(data.sectionDetails))

    } catch (error) {
      console.error(error.message)
    }
  }
}

