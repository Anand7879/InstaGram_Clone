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
import SearchUserRow from "./SearchUserRow"; // ⬅️ IMPORTANT
import Stories from "./Stories";
const HomePage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  // ---------------- NAV ITEMS ----------------
  const navItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => {
        setActivePage("home");
        setShowSearch(false);
      }
    },
    {
      icon: Search,
      label: "Search",
      onClick: () => setShowSearch(true)
    },
    { icon: Compass, label: "Explore" },
    { icon: PlaySquare, label: "Reels" },
    { icon: Send, label: "Messages" },
    { icon: Heart, label: "Notifications" },
    { icon: PlusSquare, label: "Create" },
    {
      icon: User,
      label: "Profile",
      onClick: () => {
        setActivePage("profile");
        setShowSearch(false);
      }
    }
  ];

  const bottomItems = [
    { icon: Menu, label: "Menu" },
    { icon: Grid3x3, label: "More" }
  ];

  // ---------------- SEARCH HANDLER ----------------
  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://instagram1-y5ro.onrender.com/search?q=${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setSearchResults(data);
  };

  // ---------------- SAVE RECENT ----------------
  const saveRecent = (user) => {
    const updated = [
      user,
      ...recentSearches.filter((u) => u._id !== user._id),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // ---------------- RENDER ----------------
  return (
    <div className="home-container">

      {/* ========== SIDEBAR ========== */}
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
                onClick={item.onClick}
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

      {/* ========== SEARCH OVERLAY ========== */}
      <div className={`search-panel ${showSearch ? "open" : ""}`}>
        <div className="search-header">
          <h3>Search</h3>
          <button className="close-btn" onClick={() => setShowSearch(false)}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="search-results">
          {/* RECENT */}
          {searchQuery === "" && recentSearches.length > 0 && (
            <>
              <p className="recent-title">Recent</p>
              {recentSearches.map((u) => (
                <SearchUserRow key={u._id} user={u} />
              ))}
            </>
          )}

          {/* SEARCH RESULTS */}
          {searchResults.map((user) => (
            <SearchUserRow
              key={user._id}
              user={user}
              onClick={() => saveRecent(user)}
            />
          ))}
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="main-content">
  {activePage === "home" && (
    <>
      <Stories />   {/* ⭐ STORIES HERE */}
      <Feed />
    </>
  )}

  {activePage === "profile" && <Profile />}
</div>

    </div>
  );
};

export default HomePage;
