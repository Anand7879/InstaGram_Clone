import {
  Home,
  Search,
  Compass,
  PlaySquare,
  Send,
  Heart,
  PlusSquare,
  User,
  Menu,
  Grid3x3,
  X
} from "lucide-react";

import React, { useState } from "react";
import Feed from "./Feed";
import Profile from "./Profile";   

const HomePage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activePage, setActivePage] = useState("home");  

  const navItems = [
    { icon: Home, label: "Home", onClick: () => setActivePage("home") },
    { icon: Search, label: "Search", onClick: () => setShowSearch(true) },
    { icon: Compass, label: "Explore" },
    { icon: PlaySquare, label: "Reels" },
    { icon: Send, label: "Messages" },
    { icon: Heart, label: "Notifications" },
    { icon: PlusSquare, label: "Create" },
    { icon: User, label: "Profile", onClick: () => setActivePage("profile") }  // ⬅️ PROFILE BUTTON
  ];

  const bottomItems = [
    { icon: Menu, label: "Menu" },
    { icon: Grid3x3, label: "More" }
  ];

  return (
    <div className="home-container">
      
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <h2>Instagram</h2>
        </div>

        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li
                key={index}
                className="nav-item"
                onClick={item.onClick ? item.onClick : undefined}
              >
                <item.icon size={24} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bottom-items">
          {bottomItems.map((item, index) => (
            <button key={index} className="nav-item">
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      <div className={`search-panel ${showSearch ? "open" : ""}`}>
        <div className="search-header">
          <h3>Search</h3>
          <button className="close-btn" onClick={() => setShowSearch(false)}>
            <X size={20} />
          </button>
        </div>

        <input type="text" className="search-input" placeholder="Search" />

        <div className="recent-section">
          <p>Recent</p>
        </div>
      </div>

      <div className="main-content">
        {activePage === "home" && <Feed />}
        {activePage === "profile" && <Profile />} 
      </div>
    </div>
  );
};

export default HomePage;
