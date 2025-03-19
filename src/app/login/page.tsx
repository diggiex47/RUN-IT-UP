"use client";

import React, { Component } from "react";
import { useRouter } from "next/navigation";
import "./login.css";




class Login extends Component {
  render() {
    return( 
    
    <div className="Login">
      <h6>Login Here</h6>
     
      <form>
        <div className="text-area">
          <input
          type="text"
          id="username"
          name="username"
          placeholder="Mail or username"
          className="text-input"
          />
        </div> 

       
        <div className="text-area">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              className="text-input"
            />
          </div>
          <div className="text-area">
            <button type="submit" className="submit-button">
              Login
            </button>
          </div>

          <div className="text-area">
            <button type="submit" className="submit-button">
              Forgot Password
            </button>
          </div>

         </form>

      </div>
    )
  }
}

export default Login;
