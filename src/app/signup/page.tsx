"use client";
import React, { Component } from "react";
import "./signup.css";

class SignUpPage extends Component {
  render() {
    return (
      <div className="SignUp">
      <h6>SignUp Page</h6>
     
      <form>
        <div className="text-area">
          <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="text-input"
          />
        </div> 

        <div className="text-area">
          <input
          type="text"
          id="username"
          name="username"
          placeholder="Mail"
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
            <input
              type="password"
              id="password"
              name="password"
              placeholder="confirm password"
              className="text-input"
            />
            </div>

            
          <div className="text-area">
            <button type="submit" className="submit-button">
              SignUp
            </button>
          </div>

         </form>

      </div>
    )
  }
  
}

export default SignUpPage;