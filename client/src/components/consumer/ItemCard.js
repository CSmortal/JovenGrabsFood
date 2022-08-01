import { useNavigate } from "react-router-dom"

// these cards represent a food item under the selected merchant, for the consumer to view
export default function ItemCard({ item }) {
  const { item_id: id, item_price: price, item_name: name, item_image_url: imageUrl } = item
  const navigate = useNavigate()


  return (
    <div className="itemCard" onClick={() => navigate(`../viewSelectedItem/${id}`)}>
      <h3>{name}</h3>
      <h3>{`$${price}`}</h3>
    </div>
  )
}