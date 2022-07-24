import Logout from "../others/Logout";
import { Fragment } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Merchant() {
  const navigate = useNavigate()

  return (
    <Fragment>
      <h1>Merchant</h1>
      <Logout />
      <button onClick={() => navigate("addItem")}>Add Item</button>
      <Outlet />
    </Fragment>
  )
}