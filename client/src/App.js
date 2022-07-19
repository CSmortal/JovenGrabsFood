import React, { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './components/logged-out-pages/Login'
import Register from './components/logged-out-pages/Register'
import Consumer from './components/logged-in-pages/Consumer'
import Merchant from './components/logged-in-pages/Merchant'
import Deliverer from './components/logged-in-pages/Deliverer'
// import { AuthContextProvider, AuthContext } from './context/AuthContext';
export const AuthContext = createContext()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

  // selects which route to go to if authenticated: Merchant, Consumer or Deliverer
  const selectComponentToRouteTo = () => {
    // this will be called only if isAuthenticated is true

    // remove this guard clause once tested
    if (!isAuthenticated) {
      throw new Error("isAuthenticated is false but the app tried to go to private route")
    }
    const userType = localStorage.getItem("userType")

    switch (userType) {
      // might not work since userType is a symbol of a string, not a string
      case "consumer":
        return <Consumer />

      case "merchant":
        return <Merchant />

      case "deliverer":
        return <Deliverer />

      default:
        throw new Error("Couldnt decide which private route to route to")
    }
  }

  const checkAuthenticated = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        headers: {
          token: localStorage.getItem("jwtToken")
        }
      }).then(res => res.json())

      response === true ? setIsAuthenticated(true) : setIsAuthenticated(false)

    } catch (error) {
      console.error(error.message)
    }
  }

  // const setAuth = bool => {
  //   setIsAuthenticated(bool)
  // }

  useEffect(() => {
    checkAuthenticated()
  }, [])

  return (
    // We have a Login screen and a Register screen.
    // Register screen will give 3 options to register as: Consumer, Merchant, Deliverer. Email
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>

          <Route path='/login' 
              element={
                !isAuthenticated
                  ? <Login />
                  : selectComponentToRouteTo()
              }>

          </Route>

          <Route path='/register' 
              element={
                !isAuthenticated
                  ? <Register />
                  : selectComponentToRouteTo()
              }>

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;
