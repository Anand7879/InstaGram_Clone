import React, { useEffect, useState } from "react";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

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

          <div className="profile-photo-wrapper">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.userName}`}
              alt="profile"
              className="profile-photo"
            />
          </div>

          <div>
            <div className="profile-username-section">
              <h2 className="profile-username">{user.userName}</h2>
              <button
                className="edit-btn"
                onClick={() => setShowEdit(true)}
              >
                Edit profile
              </button>
            </div>

            <div className="profile-stats">
              <p><span>{posts.length}</span> posts</p>
              <p><span>{user.followers?.length || 0}</span> followers</p>
              <p><span>{user.following?.length || 0}</span> following</p>
            </div>

            <p className="profile-bio-name">{user.userName}</p>
            <p className="profile-bio-email">{user.email}</p>
            <p className="profile-bio-text">
              Welcome to my Instagram profile 👋
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="profile-divider" />

        {/* POSTS GRID */}
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

      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <EditProfile onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
};

export default Profile;
