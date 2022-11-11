import { useNavigate } from "react-router-dom"


export default function MerchantInCategory({ merchantName, merchantAddress }) {
  // will include image of merchant later, and maybe address
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`viewMerchant/${merchantName}`)
  }
  // will add image to merchants later
  return (
    <div onClick={handleClick} className="merchantWithinCategory">
      <h2 className="text-center font-weight-bold">{`${merchantName} - ${merchantAddress}`}</h2>
    </div>
    
  )
}