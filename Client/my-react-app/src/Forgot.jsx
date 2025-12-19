import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Forgot = () => {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      console.log("Sending reset request for:", email);
      
      const res = await axios.post("https://instagram1-y5ro.onrender.com/forgot-password", { email });
      
      console.log("SERVER RESPONSE →", res.data);
      
      if (res.data.success || res.status === 200) {
        alert("Password reset link sent to your email! ✅");
        setEmail(""); // Clear input after success
      }
      
    } catch (error) {
      console.log("ERROR:", error);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Failed to send reset link"}`);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="lock-icon">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="47" stroke="currentColor" strokeWidth="2"/>
            <path d="M48 30C41.3726 30 36 35.3726 36 42V48H32C30.8954 48 30 48.8954 30 50V66C30 67.1046 30.8954 68 32 68H64C65.1046 68 66 67.1046 66 66V50C66 48.8954 65.1046 48 64 48H60V42C60 35.3726 54.6274 30 48 30ZM42 42C42 38.6863 44.6863 36 48 36C51.3137 36 54 38.6863 54 42V48H42V42Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className="forgot-title">Trouble with logging in?</h2>
        
        <p className="forgot-description">
          Enter your email address, phone number or username, and we'll send you a link to get back into your account.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-input"
          />
          
          <button type="submit" className="forgot-button">
            Send login link
          </button>
        </form>
        
        <a href="#" className="cant-reset">Can't reset your password?</a>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <Link to="/signup" className="create-account">Create New Account</Link>
        
        <Link to="/" className="back-to-login">Back to Login</Link>
      </div>
    </div>
  );
}

export default Forgot;