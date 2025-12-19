import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  
  const [input, setInput] = useState({
    userName: "",
    email: "",
    passWord: ""
  });

  function signUpFun(e) {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  }

  async function handleSignUp(e) {
    e.preventDefault(); // Prevent form submission/page reload
    
    try {
      console.log("DATA GOING TO BACKEND:", input);

      const res = await axios.post("https://instagram1-y5ro.onrender.com/create", input);

      console.log("SERVER RESPONSE →", res.data);

      // ✅ SUCCESS ALERT - After successful registration
      if (res.data.success || res.status === 201) {
        alert("Account created successfully! ✅");
        // Clear form
        setInput({
          userName: "",
          email: "",
          passWord: "",
          FullName:""
        });
        // Optional: Redirect to login page
        window.location.href = "/";
      }

    } catch (error) {
      console.log("ERROR:", error);
      
    
      if (error.response) {
       
        alert(`Signup failed: ${error.response.data.message || "Unable to create account"}`);
      } else if (error.request) {
        
        alert("Network error. Please check your connection.");
      } else {
       
        alert("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className='signUp'>
      <h1>Instagram</h1>
       <h2>Sign up to see photos and videos from your friends.</h2>
      <form onSubmit={handleSignUp}>
        <input 
            onChange={signUpFun}
            type="email" 
            placeholder='Email'
            name='email'
            value={input.email}
            required
        />
          <input 
            onChange={signUpFun}
            type="password" 
            placeholder='Password'
            name='passWord'
            value={input.passWord}
            required
            // minLength={6}
          />
        <input 
          onChange={signUpFun}
          type="text" 
          placeholder='Full Name'
          name='FullName'
          value={input.FullName}
          required
        />
         <input 
          onChange={signUpFun}
          type="text" 
          placeholder='Username'
          name='userName'
          value={input.userName}
          required
        />
        <br />
        <br />
        <button type="submit">SignUp</button>
        <br />
        <p>Already have an account? <Link to='/'>Login</Link></p>
      </form>
    </div>
  );
}

export default SignUp;