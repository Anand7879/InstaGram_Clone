import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, X } from "lucide-react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

    useEffect(() => {
  async function fetchPosts() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setPosts([]); // ✅ prevent crash
        return;
      }

      const res = await fetch("http://localhost:3000/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]); // ✅ safety
      }

    } catch (err) {
      console.error("Fetch posts failed:", err);
      setPosts([]); // ✅ avoid map crash
    } finally {
      setLoading(false);
    }
  }

  fetchPosts();
}, []);


  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/like/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likeCount: data.likeCount,
                isLiked: data.message === "Liked",
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setCommentText("");
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setCommentText("");
  };

  const submitComment = async (postId) => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`http://localhost:3000/comment/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: commentText }),
    });

    await res.json();

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                {
                  text: commentText,
                  userName: user.userName,
                },
              ],
            }
          : p
      )
    );

    setCommentText("");
  };

  if (loading) return <div className="feed">Loading...</div>;

  const modalPost =
    selectedPost &&
    (posts.find((p) => p._id === selectedPost._id) || selectedPost);

  return (
    <div className="feed">
      <div className="feed-inner">
    
        {posts.map((post) => (
          <article key={post._id} className="post">
            {/* USERNAME HEADER */}
            <header className="post-header">
              <div className="avatar">
                {post.userName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="username">{post.userName}</span>
            </header>

            {/* IMAGE */}
            <div className="post-image">
              <img src={post.imgUrl} alt="uploaded" />
            </div>

            {/* UPDATED ACTIONS AREA */}
            <div className="post-actions">
              <div className="action-row">
                <button
                  className={`like-button ${post.isLiked ? "liked" : ""}`}
                  onClick={() => handleLike(post._id)}
                >
                  <Heart
                    size={28}
                    className={post.isLiked ? "heart-icon liked" : "heart-icon"}
                  />
                </button>

                <button
                  className="comment-button"
                  onClick={() => openCommentsModal(post)}
                >
                  <MessageCircle size={28} className="comment-icon" />
                </button>
              </div>

              {/* LIKE COUNT UNDER ICONS */}
              <div className="like-count">{post.likeCount || 0} likes</div>
            </div>
          </article>
        ))}
      </div>

      {/* ==================== MODAL ==================== */}
      {modalPost && (
        <div className="post-modal-backdrop" onClick={closeCommentsModal}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCommentsModal}>
              <X size={22} />
            </button>

            <div className="post-modal-image">
              <img src={modalPost.imgUrl} alt="post" />
            </div>

            <div className="post-modal-side">
              {/* HEADER */}
              <div className="modal-header">
                <div className="avatar">
                  {modalPost.userName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="username">{modalPost.userName}</span>
              </div>

              {/* COMMENTS */}
              <div className="modal-comments">
                {modalPost.comments?.length > 0 ? (
                  modalPost.comments.map((c, index) => (
                    <div key={index} className="modal-comment">
                      <strong>{c?.userName || "User"}</strong> {c?.text || ""}
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No comments yet</p>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <div className="modal-actions-row">
                  <button
                    className={`like-button ${
                      modalPost.isLiked ? "liked" : ""
                    }`}
                    onClick={() => handleLike(modalPost._id)}
                  >
                    <Heart
                      size={28}
                      className={
                        modalPost.isLiked ? "heart-icon liked" : "heart-icon"
                      }
                    />
                  </button>

                  <button
                    className="comment-button"
                    onClick={() => {
                      const input = document.querySelector(
                        ".modal-comment-input"
                      );
                      input && input.focus();
                    }}
                  >
                    <MessageCircle size={28} className="comment-icon" />
                  </button>
                </div>

                <span className="like-count">
                  {modalPost.likeCount || 0} likes
                </span>

                <div className="add-comment modal-add-comment">
                  <input
                    type="text"
                    className="modal-comment-input"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => submitComment(modalPost._id)}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
