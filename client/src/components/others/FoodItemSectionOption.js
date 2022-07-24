
export default function FoodItemSectionOption({ description, priceChange }) {
  return (
    // we want to put the description and price_change beside each other
    <div>
      <input type="text" value={description} onChange={}/>
      <input type="number" value={priceChange}/>
    </div>
  )
}