import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import landingImage from './assets/landing-3x.png'

const LoginInsta = () => {

const [input, setInput] = useState({
    email: "",
    passWord: ""
  });

const [errorMsg, setErrorMsg] = useState("");

  function loginFun(e) {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  }

  async function done(e) {
    e.preventDefault();
    
    try {
      console.log("DATA GOING TO BACKEND:", input);

      const res = await axios.post("https://instagram1-y5ro.onrender.com/login", input);

      console.log("SERVER RESPONSE →", res.data);

      if (res.data.success || res.status === 200) {
        
        // Save token and user to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Login successful! ✅");

        // Redirect to home page
      window.location.href = "/home";
      }

    } catch (error) {
  console.log("ERROR:", error);

  if (error.response) {
    setErrorMsg(error.response.data.message || "Invalid credentials");
  } else {
    setErrorMsg("Network error. Please try again.");
  }
}

  }

  return (
    <div className='container'>

      <div className='leftSection'>
             <img src={landingImage} />
      </div>
      <div className='right-section'>
         <h1>Instagram</h1>
      <form onSubmit={done}>
        <input 
          onChange={loginFun} 
          type="email" 
          placeholder='Email' 
          name='email' 
          value={input.email}
          required
        />
        
        <input 
          onChange={loginFun}
          type="password" 
          placeholder='Password'
          name='passWord'
          value={input.passWord}
          required
        />
        <button type="submit">Login</button>
        <div className="or-divider">OR</div>
  
        {errorMsg && (
        <p className="error-message">{errorMsg}</p>
        )}

       <div>
        <Link to="/forgot-password" className="forgot-link">
           Forgotten your Password?
        </Link>
       </div>

        <br />
        <p className='p1'>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
      </div>
      
    </div>
  )
}

export default LoginInsta