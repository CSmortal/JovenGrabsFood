import React, { Fragment, useState } from 'react'
import FoodItemSection from '../others/FoodItemSection'
const axios = require('axios')

let sectionCount = 0

export default function MerchantAddItem() {

  const [selectedFile, setSelectedFile] = useState()
  const [price, setPrice] = useState()
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState([])

  const addSection = () => {
    if (sectionCount > 5) {
      console.log("Cannot add more than 5 sections to item")
      return
    }

    let newSection = {
      id: ++sectionCount,
      section_name: "",
      options: [{
        description: "",
        price_change: 0
      }]
    };

    setSections(oldSections => {
      return oldSections.push(newSection)
    })
  }

  const removeSection = (idToRemove) => {
    sectionCount--;
    setSections(oldSections => oldSections.filter(
      oldSection => oldSection.id !== idToRemove
    ))
  }
  
  const setSectionTitle = (idToSet, newData) => {
    const newSections = sections.map(section => {
      if (section.id !== idToSet) return section
      else {
        return newData
      }
    })

    setSections(newSections)
  }

  const handleSelectFile = e => {
    setSelectedFile(e.target.files[0])
  }

  
  const handleSubmission = async (e) => {
    e.preventDefault()
    const data = new FormData()

    data.append("imageInput", selectedFile)
    

    const response = await axios.post("http://localhost:5000/aws/insert-food-image", data)

    // call the backend route for adding the food item
  }

  return (
    <>
      <h1>MerchantAddItem</h1>
      <form>
        <input type="file" name="imageInput" onChange={e => handleSelectFile(e)}
            accept="image/*"/>
        <button onClick={e => handleSubmission(e)}>Submit image</button>
        {selectedFile && <img src={`http://localhost:5000/aws/${selectedFile.name}`} alt="" />}
        <input type="number" placeholder="Price of item" value={price} onChange={e => setPrice(e.target.value)}/>

        {sections.map(section => (
          <FoodItemSection 
            key={section.id}
            removeSection={removeSection}
            setSection={setSection}
            value={section}
          />)
        )}
        <button onClick={addSection}>Add Section</button>
      </form>


    </>

  )
}