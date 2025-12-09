import React, { useState, useEffect } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/posts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="feed">Loading...</div>;

  return (
    <div className="feed">
      <div className="feed-inner">
        {posts.map((post) => (
          <article key={post._id} className="post">

            {/* USERNAME */}
            <header className="post-header">
              <div className="avatar">
                {post.userName?.[0]?.toUpperCase() || "U"}
              </div>

              <span className="username">
                {post.userName}
              </span>
            </header>

            {/* IMAGE */}
            <div className="post-image">
              <img src={post.imgUrl} alt="uploaded" />
            </div>

          </article>
        ))}
      </div>
    </div>
  );
};

export default Feed;
