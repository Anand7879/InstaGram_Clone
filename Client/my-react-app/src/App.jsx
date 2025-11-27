import React from 'react'
import SignUp from './SignUp'
import LoginInsta from './LoginInsta'
import Forgot from './Forgot'
import ResetPassword from './ResetPassword'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Upload from './Upload'
const App = () => {
  return (
    <div>
      <Routes>
        <Route   path='/' element={<LoginInsta/>}/>
        <Route path='/home' element={<Home/>}/>
        {/* <Route   path='/' element={<Upload/>}/> */}
        <Route   path='/signup' element={<SignUp/>}/>
        <Route   path='/forgot-password' element={<Forgot/>}/>
        <Route   path='/reset/:token' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App 