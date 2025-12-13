import React, { useState } from "react";

const EditProfile = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Male");
  const [website, setWebsite] = useState("");

  return (
    <div className="edit-backdrop">
      <div className="edit-container">
        <h2 className="edit-title">Edit Profile</h2>

        {/* USER ROW */}
        <div className="edit-user-row">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.userName}`}
            alt="avatar"
          />
          <div>
            <strong>{user.userName}</strong>
            <p>{user.email}</p>
          </div>
          <button className="change-photo-btn">Change photo</button>
        </div>

        {/* WEBSITE */}
        <label>Website</label>
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        {/* BIO */}
        <label>Bio</label>
        <textarea
          maxLength={150}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <span className="char-count">{bio.length}/150</span>

        {/* GENDER */}
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <div className="suggestion-box">
          <span>Show account suggestions on profiles</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="edit-actions">
          <button className="submit-btn">Submit</button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
