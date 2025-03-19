"use client";

import React, { Component, FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
import { useState } from "react";

 

 const Login = () => {
   // ✅ State variables with inferred types
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [error, setError] = useState<string>("");

   const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ( !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      })

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "something went wrong.");
        return;
      }


      router.push("/product");
    }

    catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }

  }


    return( 
    
    <div className="Login">
      <h6>Login Here</h6>
     
      <form onSubmit = {handleSubmit}>
        <div className="text-area">
          <input
          type="text"
          id="email"
          name="email"
          placeholder="Mail"
          className="text-input"
          value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> 

       
        <div className="text-area">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              className="text-input"
              value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-area">
            <button type="submit" className="submit-button">
              Login
            </button>
          </div>

          {/* <div className="text-area">
            <button type="submit" className="submit-button">
              Forgot Password
            </button>
          </div> */}

         </form>

      </div>
    )
};

export default Login;
