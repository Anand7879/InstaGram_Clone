import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  
  const [input, setInput] = useState({
    password: "",
    confirmPassword: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate passwords match
    if (input.password !== input.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate password length
    if (input.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    
    try {
      console.log("Resetting password with token:", token);
      
      const res = await axios.post(`http://localhost:3000/reset-password/${token}`, {
        password: input.password
      });
      
      console.log("SERVER RESPONSE →", res.data);
      
      if (res.data.success || res.status === 200) {
        alert("Password reset successful! ✅");
        setInput({ password: "", confirmPassword: "" });
        // Redirect to login after 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
      
    } catch (error) {
      console.log("ERROR:", error);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Invalid or expired reset link"}`);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className='reset-password'>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder='Enter new password' 
          name='password'
          value={input.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <br />
        <input 
          type="password" 
          placeholder='Confirm new password' 
          name='confirmPassword'
          value={input.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
        <br />
        <br />
        <button type="submit">Reset Password</button>
        <br />
        <p><Link to="/">Back to Login</Link></p>
      </form>
    </div>
  );
}

export default ResetPassword;