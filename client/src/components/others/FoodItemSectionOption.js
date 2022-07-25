import { useDispatch } from 'react-redux'
import { addFoodItemActions as actions } from '../../store/addFoodItemSlice'

export default function FoodItemSectionOption({ sectionId, optionId, description, priceChange }) {
  const dispatch = useDispatch()

  return (
    // we want to put the description and price_change beside each other
    <div className="foodItemOption">
      <input 
        type="text" 
        placeholder="Option description" 
        value={description} 
        onChange={e => {
          dispatch(
            actions.setOptionDescription({
              sectionId,
              optionId,
              description: e.target.value
            })
          )
        }}
      />

      <input 
        type="number"
        placeholder="Price change on option selected" 
        value={priceChange}
        onChange={e => dispatch(
          actions.setOptionPriceChange({
            sectionId,
            optionId,
            priceChange: e.target.value
          })
        )}
      />

      <button onClick={e => {
        e.preventDefault();
        dispatch(actions.removeOption({sectionId, optionId}))
      }}>-</button>
    </div>
  )
}