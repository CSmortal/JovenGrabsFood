import React, { useState, useContext, Fragment } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { AuthContext } from '../../App';
import { userDetailsSliceActions } from '../../store/userDetailsSlice';


export default function Register() {

  const { setIsAuthenticated } = useContext(AuthContext)
  const [userType, setUserType] = useState("merchant")

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
  })
  const { email, password, name, address } = inputs
  const dispatch = useDispatch()

  const onInputChange = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const handleUserTypeChange = e => {
    setUserType(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({...inputs, userType})
      }).then(res => res.json())
      
      
      // we need to pass jwt token to client
      if (response) {
        localStorage.setItem("jwtToken", response.jwtToken)
        localStorage.setItem("userType", response.userType)
        localStorage.setItem("userName", response.userName)
        setIsAuthenticated(true)
        dispatch(userDetailsSliceActions.setUserDetails({
          name: response.userName,
          address: response.userAddress,
        }))
      }


    } catch (error) {
      console.error(error.message)
    }
  }
  

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Register</h1>

      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={e => onInputChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={e => onInputChange(e)}
          className="form-control my-3"
        />
        <input
          type="text"
          name="name"
          value={name}
          placeholder="name"
          onChange={e => onInputChange(e)}
          className="form-control my-3"
        />
        { userType !== "deliverer" && 
            <input
              type="text"
              name="address"
              value={address}
              placeholder="address"
              onChange={e => onInputChange(e)}
              className="form-control my-3"
            />
        }
        

        <h2>Are you using JovenGrabsFood as a ...</h2>

        <div onChange={e => handleUserTypeChange(e)}>
          <label>
            <input 
              type="radio"
              name="userType"
              value="merchant"
              checked={userType === "merchant"}
            />
            Merchant?
          </label>
          
          <label>
            <input 
              type="radio" 
              name="userType"
              value="consumer"
              checked={userType === "consumer"}
            />
            Consumer?
          </label>

          <label>
            <input 
              type="radio"
              name="userType" 
              value="deliverer"
              checked={userType === "deliverer"}
            />
            Deliverer?
          </label>
        </div>

        {/* <fieldset>
          <legend>Are you using JovenGrabsFood as a ...</legend>



        </fieldset> */}

        <button className="btn btn-success btn-block">Submit</button>
      </form>

      <Link to="/login">Go to login page</Link>
    </Fragment>
  )
}