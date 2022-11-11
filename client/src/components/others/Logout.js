import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { AuthContext } from "../../App"
import { userDetailsSliceActions } from '../../store/userDetailsSlice'

export default function Logout() {
  const { setIsAuthenticated } = useContext(AuthContext) 
  const dispatch = useDispatch()

  const logout = e => {
    e.preventDefault();
    try {
      localStorage.clear()
      setIsAuthenticated(false)
      dispatch(userDetailsSliceActions.removeUserDetails())
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <button onClick={e => logout(e)}>Logout</button>
  )
}