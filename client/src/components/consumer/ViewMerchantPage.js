import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllItemsFromMerchant } from "../../store/dbActions";
import ItemCard from './ItemCard'

// Shows all food items under selected merchant
export default function ViewMerchantPage() {
  const { name: merchantName } = useParams()
  const dispatch = useDispatch()
  const { itemsList } = useSelector(state => state.merchantItems)

  useEffect(() => {
    dispatch(getAllItemsFromMerchant(merchantName))
  }, [dispatch, merchantName])

  // console.log(itemsList)

  return (
    <>
      {itemsList && itemsList.map(item => <ItemCard key={item.item_id} item={item}/>)}
    </>
    
  )
}