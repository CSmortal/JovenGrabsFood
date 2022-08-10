import { useNavigate } from "react-router-dom"


export default function MerchantInCategory({ merchantName }) {
  // will include image of merchant later, and maybe address
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`viewMerchant/${merchantName}`)
  }

  return (
    <div onClick={handleClick} className="merchantWithinCategory">
      <h2 className="text-center font-weight-bold">{merchantName}</h2>
    </div>
    
  )
}