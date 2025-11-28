// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';

// const Home = () => {
//   const [posts, setPosts] = useState([]);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (!token || !userData) {
//       navigate('/');
//       return;
//     }
    
//     setUser(JSON.parse(userData));
//     fetchPosts();
//   }, [navigate]);

//   const fetchPosts = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:3000/posts', {
//         headers: { Authorization: token }
//       });
//       setPosts(res.data);
//     } catch (err) {
//       console.error('Error fetching posts:', err);
//     }
//   };

//   const handleLike = async (postId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(`http://localhost:3000/like/${postId}`, {}, {
//         headers: { Authorization: token }
//       });
      
//       setPosts(posts.map(post => 
//         post._id === postId 
//           ? { ...post, likeCount: res.data.likeCount, isLiked: !post.isLiked }
//           : post
//       ));
//     } catch (err) {
//       console.error('Error liking post:', err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   return (
//     <div className="home-container">
//       {/* Use the HTML from the artifact above */}
//       <div className="header">
//         <div className="logo">Instagram</div>
//         <div className="header-icons">
//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </div>
//       </div>

//       <div className="container">
//         <div id="postsContainer">
//           {posts.length === 0 ? (
//             <div className="empty-state">
//               <h2>No Posts Yet</h2>
//               <p>Start sharing photos to see them here</p>
//             </div>
//           ) : (
//             posts.map(post => (
//               <div key={post._id} className="post">
//                 <div className="post-header">
//                   <div className="post-user">
//                     <div className="post-avatar"></div>
//                     <span className="post-username">{post.userName}</span>
//                   </div>
//                 </div>

//                 <div className="post-image">
//                   <img src={post.imgUrl} alt="Post" />
//                 </div>

//                 <div className="post-actions">
//                   <button 
//                     className={`action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
//                     onClick={() => handleLike(post._id)}
//                   >
//                     ❤️
//                   </button>
//                 </div>

//                 <div className="post-likes">
//                   {post.likeCount || 0} {post.likeCount === 1 ? 'like' : 'likes'}
//                 </div>

//                 <div className="post-caption">
//                   <span className="caption-username">{post.userName}</span>
//                   <span>{post.caption || 'No caption'}</span>
//                 </div>

//                 <div className="post-time">
//                   {new Date(post.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;



import React from 'react'

const Home = () => {
  return (
  <div class="instagram-layout">
  <aside class="left-sidebar">
    <div class="ig-logo">Instagram</div>

    <nav class="menu">
      <a href="#" class="menu-item">🏠 Home</a>
      <a href="#" class="menu-item">🔍 Search</a>
      <a href="#" class="menu-item">🧭 Explore</a>
      <a href="#" class="menu-item">🎬 Reels</a>
      <a href="#" class="menu-item">📩 Messages</a>
      <a href="#" class="menu-item">❤️ Notifications</a>
      <a href="#" class="menu-item">➕ Create</a>
      <a href="#" class="menu-item">👤 Profile</a>
      <a href="#" class="menu-item">☰ More</a>
    </nav>
  </aside>

</div>

  )
}

export default Home