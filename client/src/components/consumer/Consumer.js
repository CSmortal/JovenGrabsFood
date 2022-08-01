import Logout from "../others/Logout";
import { Fragment, useEffect, useState } from 'react'
import MerchantsInCategory from "./MerchantsInCategory";
import { Outlet, useLocation } from "react-router-dom";
const axios = require('axios')

export default function Consumer() {
  // Consumer has a cart as well as a list of all the restaurants that he can select to enter their store and see their items

  const [foodCategories, setFoodCategories] = useState()
  const location = useLocation()
  const isAtConsumerHomePage = location.pathname === '/consumer'

  useEffect(() => {
    const getFoodCategoriesFromDb = async () => {
      const response = await axios.get("http://localhost:5000/db/food-categories").then(res => res.data)
      return response
    }

    try {
      getFoodCategoriesFromDb().then(res => setFoodCategories(res))
    } catch (error) {
      console.error(error.message)
    }
  }, [])


  return (
    <Fragment>
      <h1>Consumer</h1>
      <Logout />
      {/* We will add a cart feature to the navbar later */}

      <Outlet />
      
      {foodCategories && isAtConsumerHomePage && foodCategories.map(category => {
        return (
          <div key={category}>
            <h2>{category}</h2>
            <MerchantsInCategory category={category} />
          </div>

        )
      })}
      
    </Fragment>
  )
}