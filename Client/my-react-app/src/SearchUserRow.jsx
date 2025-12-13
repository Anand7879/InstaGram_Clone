import React, { useState } from "react";

const SearchUserRow = ({ user, onClick }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followers, setFollowers] = useState(user.followersCount);

  const toggleFollow = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/follow/${user._id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIsFollowing(!isFollowing);
    setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
  };

  return (
    <div className="search-user-row" onClick={onClick}>
      <div className="user-left">
        <div className="avatar">
          {user.userName[0].toUpperCase()}
        </div>
        <div>
          <strong>{user.userName}</strong>
          <p>{followers} followers</p>
        </div>
      </div>

      <button
        className={`follow-btn ${isFollowing ? "following" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFollow();
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default SearchUserRow;
