import { useState, Fragment } from 'react'
import FoodItemSectionOption from './FoodItemSectionOption'
import { useDispatch } from 'react-redux'
import { addFoodItemActions as actions } from '../../store/addFoodItemSlice'

export default function FoodItemSection({ id, value }) {
  const dispatch = useDispatch()

  return (
    <>
      <div className="mt-4">
        {/* Position this button to the top right, and transform into some icon with a minus */}
        <button onClick={e => {
          e.preventDefault()
          dispatch(actions.removeSection(id))
        }}>-</button>

        <input 
          type="text" 
          placeholder="Section Name" 
          value={value.section_name} 
          onChange={e => dispatch(actions.setSectionName({
            idToEdit: id,
            newSectionName: e.target.value
          }))}
        />

        {value.options.map(option => (
          <FoodItemSectionOption
            key={option.id}
            sectionId={id}
            optionId={option.id} 
            description={option.description}
            priceChange={option.price_change}
          />
        ))}

      </div>

      <div>
        <button onClick={e => {
          e.preventDefault();
          dispatch(actions.addOption(id))
        }}>Add Option</button>
      </div>
    </>

  )
}