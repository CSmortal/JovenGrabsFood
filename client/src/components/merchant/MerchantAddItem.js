import React, { Fragment, useState, useEffect } from 'react'
import FoodItemSection from './FoodItemSection'
import { useDispatch, useSelector } from 'react-redux'
import { addFoodItemActions as actions } from '../../store/addFoodItemSlice'
import { fetchFoodCategories } from '../../store/dbActions'
const axios = require('axios')

// come back later to find out how to save images (non serialisable) to redux

export default function MerchantAddItem() {
  const dispatch = useDispatch()
  const { price, name, imageFile, sections, category } = useSelector(state => state.addFoodItem)
  const [selectedFile, setSelectedFile] = useState()
  const [foodCategories, setFoodCategories] = useState()
  const merchantName = localStorage.getItem("userName")
  

  const handleSubmission = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("imageInput", selectedFile)

    try {
      const awsResponse = await axios.post("http://localhost:5000/aws/insert-food-image", data).then(res => res.data)

      /*
        {
          ETag: '"759920d7a51dea15bed0924d6ad26432"',
          Location: 'https://jpzx-jovengrabsfood-foodimages.s3.amazonaws.com/ACKD4796.jpg',
          key: 'ACKD4796.jpg',
          Key: 'ACKD4796.jpg',
          Bucket: 'jpzx-jovengrabsfood-foodimages'
        }
      */
    
      // call the backend route for adding the food item
      const dbResponse = await axios.post("http://localhost:5000/db/food-item", {
        itemName: name,
        itemPrice: price,
        imageUrl: awsResponse.Location,
        itemSections: sections,
        merchantName,
        itemCategory: category,
      })

      // console.log(dbResponse)

    } catch (error) {
      console.error(error.message)
    }
    
  }

  const handleSelectFile = e => {
    setSelectedFile(e.target.files[0])
  }

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
    <>
      <h1>MerchantAddItem</h1>

      <form>
        <input 
          type="file" 
          name="imageInput" 
          onChange={e => 
            // dispatch(actions.setItemImage(e.target.files[0]))
            handleSelectFile(e)
          }
          accept="image/*"
        />

        {/* <button onClick={e => handleSubmission(e)}>Submit image</button> */}

        {/* {selectedFile && <img src={`http://localhost:5000/aws/${selectedFile.name}`} alt="" />} */}

        <input 
          type="text"
          placeholder="Name of item"
          value={name}
          onChange={e => dispatch(actions.setItemName(e.target.value))} 
        />

        <input 
          type="number" 
          placeholder="Price of item" 
          value={price} 
          onChange={e => dispatch(actions.setItemPrice(e.target.value))}
        />

        <label htmlFor="category-select">Select a food category:</label>
        <select 
          name="categories" 
          id="category-select" 
          onChange={e => dispatch(actions.setItemCategory(e.target.value))}
        >
          {foodCategories && foodCategories.map(category => {
            return (<option key={category}>{category}</option>)
          })}
        </select>

        {sections && sections.map(section => (
          <FoodItemSection 
            key={section.id}
            id={section.id}
            value={section}
          />)
        )}

        <button className="mt-5" onClick={e => {
          e.preventDefault()
          dispatch(actions.addSection())
        }}>Add Section</button>

        <button 
          className="position-absolute bottom-0 start-50 translate-middle"
          onClick={e => handleSubmission(e)}
        >
          Add "{name}" to {merchantName}
        </button>
      </form>
    </>

  )
}