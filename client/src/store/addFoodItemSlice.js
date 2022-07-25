import { createSlice, current } from '@reduxjs/toolkit'

let sectionIdCounter = 0
let optionIdCounter = 0

export const addFoodItemSlice = createSlice({
  name: 'addFoodItem',

  initialState: {
    price: "",
    name: "",
    imageFile: "",
    sections: [] 
  },

  reducers: {
    addSection(state) {
      if (sectionIdCounter > 5) {
        console.log("Cannot add more than 5 sections to item")
        return
      }
  
      let newSection = {
        id: ++sectionIdCounter,
        section_name: "",
        options: []
      };
      state.sections.push(newSection)
    },

    removeSection(state, action) {
      // sectionIdCounter--; This would possibly result in two sections with the same id
      const idToRemove = action.payload
      state.sections = state.sections.filter(section => section.id !== idToRemove)
    },

    setItemPrice(state, action) {
      state.price = action.payload
    },

    setItemName(state, action) {
      state.name = action.payload
    },

    setItemImage(state, action) {
      state.imageFile = action.payload
    },

    setSectionName(state, action) {
      const { idToEdit, newSectionName } = action.payload
      state.sections.map(section => {
        if (section.id === idToEdit) {
          section.section_name = newSectionName
        }
        return section
      })
    },

    addOption(state, action) {
      const sectionIdToEdit = action.payload
      const sectionToEdit = state.sections.find(section => section.id === sectionIdToEdit)
      const newSectionOption = {
        id: ++optionIdCounter,
        description: "",
        priceChange: ""
      }

      sectionToEdit.options.push(newSectionOption)
    },

    removeOption(state, action) {
      // optionIdCounter--
      const { sectionId, optionId } = action.payload
      const indexOfRelevantSection = state.sections.findIndex(section => section.id === sectionId)
      let options = state.sections[indexOfRelevantSection].options
      state.sections[indexOfRelevantSection].options = options.filter(option => option.id !== optionId)
    },


    setOptionPriceChange(state, action) {
      const { sectionId, optionId, priceChange } = action.payload
      const sectionIndex = state.sections.findIndex(section => section.id === sectionId)
      let relevantSection = state.sections[sectionIndex]

      relevantSection.options = relevantSection.options.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            priceChange: priceChange
          }
        } else {
          return option
        }
      })
    },

    setOptionDescription(state, action) {
      const { sectionId, optionId, description } = action.payload

      const sectionIndex = state.sections.findIndex(section => section.id === sectionId)
      let relevantSection = state.sections[sectionIndex]

      relevantSection.options = relevantSection.options.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            description: description
          }
        } else {
          return option
        }
      })
    },



  }
})

export const addFoodItemActions = addFoodItemSlice.actions
export default addFoodItemSlice.reducer