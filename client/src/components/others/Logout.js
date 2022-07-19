import { useContext } from 'react'
import { AuthContext } from "../../App"

export default function Logout() {
  const { setIsAuthenticated } = useContext(AuthContext) 

  const logout = e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken")
      localStorage.removeItem("userType")
      setIsAuthenticated(false)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <button onClick={e => logout(e)}>Logout</button>
  )
}