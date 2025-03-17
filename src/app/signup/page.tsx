"use client";

import React, { FormEvent } from "react"; // Import FormEvent type
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";

// ✅ Function Component: we can define its type explicitly (optional)
const SignUpPage = () => {
  // ✅ State variables with inferred types
  const [username, setUsername] = useState<string>(""); // string state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // ✅ Function to handle form submission with explicit type on event (e)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Basic Frontend Validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // 2. Send Data to Backend (POST /api/signup)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // 3. Signup Successful ➜ Redirect to product page
      router.push("/product");
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="SignUp">
      <h6>Sign Up Page</h6>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="text-area">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            className="text-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // e is typed automatically by TS
          />
        </div>

        <div className="text-area">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
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
            placeholder="Password"
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-area">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="text-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="text-area">
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
};

export default SignUpPage;
