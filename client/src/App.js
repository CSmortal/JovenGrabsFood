import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/logged-out-pages/Login'
import Register from './components/logged-out-pages/Register'
import Consumer from './components/logged-in-pages/Consumer'
import Merchant from './components/logged-in-pages/Merchant'
import Deliverer from './components/logged-in-pages/Deliverer'
import MerchantAddItem from './components/logged-in-pages/MerchantAddItem';

export const AuthContext = createContext()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // selects which route to go to if authenticated: Merchant, Consumer or Deliverer
  const selectComponentToRouteTo = () => {
    // remove this guard clause once tested

    if (!isAuthenticated) {
      throw new Error("isAuthenticated is false but the app tried to go to private route")
    }
    const userType = localStorage.getItem("userType")

    return <Navigate to={`/${userType}`} />
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


  useEffect(() => {
    checkAuthenticated()
  }, [])

  return (
    // We have a Login screen and a Register screen.
    // Register screen will give 3 options to register as: Consumer, Merchant, Deliverer. Email
    // paths that start with '/' are absolute paths
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route index element={!isAuthenticated ? <Login /> : selectComponentToRouteTo()}/>
          <Route path='/login' element={!isAuthenticated ? <Login /> : selectComponentToRouteTo()} />
          <Route path='/register' element={!isAuthenticated ? <Register /> : selectComponentToRouteTo()}/>
    
          <Route path='/merchant' element={isAuthenticated ? <Merchant /> : <Navigate to="/login" replace={true}/>}>
            <Route path='addItem' element={<MerchantAddItem />}/>
          </Route>
          <Route path='/consumer' element={isAuthenticated ? <Consumer /> : <Navigate to="/login" replace={true}/>}/>
          <Route path='/deliverer' element={isAuthenticated ? <Deliverer /> : <Navigate to="/login" replace={true}/>}/>

        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;
