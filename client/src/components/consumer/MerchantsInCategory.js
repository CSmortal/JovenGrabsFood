import { useState, useEffect } from 'react'
import MerchantInCategory from './MerchantInCategory'
const axios = require('axios')

export default function MerchantsInCategory({ category }) {
  const [merchants, setMerchants] = useState([]) // array of merchant objects {merchantName: __, merchantAddress: ___}
  // 1. state that contains all merchants that sell items of this category
  useEffect(() => {
    // might want to change this later because this is one network call per category
    const getMerchantsForCategory = async () => {
      const response = await axios.get(`http://localhost:5000/db/merchants-by-category/${category}`)
        .then(res => res.data)
      return response
    }
    
    try {
      getMerchantsForCategory().then(res => setMerchants(res))
    } catch (error) {
      console.error(error.message)
    }
  }, [category])

  return (
    <div className="merchantsWithinCategory">
      { merchants.length > 0 && merchants.map(merchantObj => (
        <MerchantInCategory 
          key={`${merchantObj.merchantName} ${merchantObj.merchantAddress}`} 
          merchantName={merchantObj.merchantName}
          merchantAddress={merchantObj.merchantAddress}
        />) 
      )}
    </div>
  )
}