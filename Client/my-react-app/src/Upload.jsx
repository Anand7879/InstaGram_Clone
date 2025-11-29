import React from 'react'
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { useState } from 'react';

const supabaseUrl = "https://kvlbbsunsjcawuvfrcsd.supabase.co";
const supabaseKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bGJic3Vuc2pjYXd1dmZyY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDA0MzQsImV4cCI6MjA3OTI3NjQzNH0.IxiNfcsy_rB9KeY-td7cogerZcWwJlaIFxis4lhs3Wk'

const supabase = createClient(supabaseUrl, supabaseKey);

const Upload = () => {

const [Img, setImg] = useState(null);
const handleFileChange = (e) => {

    setImg(e.target.files[0]);
 };   

  async function save() {
    if (!Img) {
      alert("Please select an image first!");
      return;
    }

    try {
      // 1️⃣ Upload image to Supabase
        const { data, error } = await supabase.storage
  .from("Insta")
  .upload("insta_images/" + Img.name, Img, { upsert: true });

      if (error) throw error;

      // 2️⃣ Get public URL
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/Insta/insta_images/${Img.name}`;
      console.log("Image URL:", imageUrl);

       // 3️⃣ Get token and user from localStorage
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user')); // Get user data

      console.log('Token:', token);
      console.log('User data:', userData);

      let res = await axios.post(
        "http://localhost:3000/upload",
        {
          userName: userData.userName, 
          imgUrl: imageUrl, 
          user: userData._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert("✅ Image uploaded and saved successfully!");
      console.log(res.data);
      
      setImg(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Error uploading image. Check console for details.");
    }
  }

  return (
    <div className='container'>
        <input type="file" onChange={handleFileChange}/>
        <button
        onClick={save}
        >
        Upload
      </button>
    </div>
  )
}

export default Upload