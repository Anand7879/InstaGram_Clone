import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch logged-in user
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUser(data);

    // Fetch posts of this user
    fetchUserPosts(data._id);
  };

  // Fetch user's posts
  const fetchUserPosts = async (userId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/user-posts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="text-white">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-content">

        {/* ===== TOP SECTION ===== */}
        <div className="profile-top">
          
          {/* Profile Photo */}
          <div className="profile-photo-wrapper">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.userName}`}
              alt="profile"
              className="profile-photo"
            />
          </div>

          {/* User Info */}
          <div>
            <div className="profile-username-section">
              <h2 className="profile-username">{user.userName}</h2>
              <button className="edit-btn">Edit profile</button>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <p><span>{posts.length}</span> posts</p>
              <p><span>{user.followers?.length || 0}</span> followers</p>
              <p><span>{user.following?.length || 0}</span> following</p>
            </div>

            {/* Bio */}
            <p className="profile-bio-name">{user.userName}</p>
            <p className="profile-bio-email">{user.email}</p>
            <p className="profile-bio-text">Welcome to my Instagram profile 👋</p>
          </div>
        </div>

        {/* Divider */}
        <div className="profile-divider" />

        {/* Tabs */}
      <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-gray-400 mt-4 mb-4">
           <button className="flex gap-1 items-center text-white border-t border-white pt-2">
              <svg
              aria-label="Posts"
              fill="currentColor"
              height="12"
              viewBox="0 0 24 24"
              width="12"
            >
              <rect
                fill="none"
                height="18"
                width="18"
                x="3"
                y="3"
                stroke="currentColor"
                strokeWidth="2"
              ></rect>
              <line
                stroke="currentColor"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="9"
                y2="9"
              ></line>
              <line
                stroke="currentColor"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="15"
                y2="15"
              ></line>
              <line
                stroke="currentColor"
                strokeWidth="2"
                x1="9"
                x2="9"
                y1="3"
                y2="21"
              ></line>
              <line
                stroke="currentColor"
                strokeWidth="2"
                x1="15"
                x2="15"
                y1="3"
                y2="21"
              ></line>
            </svg>
            Posts
          </button>
        </div>

        {/* Posts Grid */}
        <div className="profile-post-grid">
          {posts.map((p, i) => (
            <div key={i} className="profile-post">
              <img src={p.imgUrl} alt="post" />

              <div className="post-overlay">
                <span>❤️ {p.likeCount || 0}</span>
                <span>💬 {p.comments?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
