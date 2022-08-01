import { useState, useEffect } from 'react'
import MerchantInCategory from './MerchantInCategory'
const axios = require('axios')

export default function MerchantsInCategory({ category }) {
  const [merchantNames, setMerchantNames] = useState()
  // 1. state that contains all merchants that sell items of this category
  useEffect(() => {
    // might want to change this later because this is one network call per category
    const getMerchantsForCategory = async () => {
      const response = await axios.get(`http://localhost:5000/db/merchants-by-category/${category}`)
        .then(res => res.data)
      return response
    }
    
    try {
      getMerchantsForCategory().then(res => setMerchantNames(res))
    } catch (error) {
      console.error(error.message)
    }
  }, [category])

  return (
    <div className="merchantsWithinCategory">
      { merchantNames && merchantNames.map(name => <MerchantInCategory key={name} merchantName={name} />) }
    </div>
  )
}