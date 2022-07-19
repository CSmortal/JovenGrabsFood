import React, { useState, useContext, Fragment } from 'react'
import { Link } from "react-router-dom";
import { AuthContext } from '../../App';


export default function Login() {

  const { setIsAuthenticated } = useContext(AuthContext)
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })
  const { email, password } = inputs

  const onInputChange = (e) => {
  
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    }) 
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()

    const body = { email, password }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      ).then(res => res.json())
      

      if (response) {
        console.log(response)
        localStorage.setItem("jwtToken", response.jwtToken)
        localStorage.setItem("userType", response.userType)
        setIsAuthenticated(true) // responsible for routing to the next route from login screen
      }

    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Login</h1>

      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={e => onInputChange(e)}
          className="form-control my-3"
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => onInputChange(e)}
          className="form-control my-3"
          placeholder="password"
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>

      <Link to="/register">Go to register page</Link>

    </Fragment>
  )
}