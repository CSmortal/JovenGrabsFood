import { useState } from 'react'
import FoodItemSectionOption from './FoodItemSectionOption'


export default function FoodItemSection({ key, removeSection, setSection, value }) {
  
  const [sectionData, setSectionData] = useState(value)

  return (
    <div>
      {/* Position this button to the top right, and transform into some icon with a minus */}
      <button onClick={() => removeSection(key)}>Remove Section</button>

      <input 
        type="text" 
        placeholder="Section Title" 
        value={value.section_name} 
        onChange={() => setSection(key, sectionData)}
      />

      {value.options.map(option => (
        <FoodItemSectionOption 
          description={option.description}
          priceChange={option.price_change}
          setSection={setSection}
        />
      ))}
    </div>
  )
}