import React, { useEffect, useState } from "react";
import StoryViewer from "./StoryViewer";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [openViewer, setOpenViewer] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const me = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://instagram1-y5ro.onrender.com/stories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setStories(data);
  };

  const openStory = (index) => {
    setStartIndex(index);
    setOpenViewer(true);
  };

  return (
    <>
      <div className="stories-bar">
        {stories.map((story, index) => (
          <div
            key={story._id}
            className="story-item"
            onClick={() => openStory(index)}
          >
            <div className="story-ring active">
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${story.user.userName}`}
                alt="story"
              />
            </div>
            <span>{story.user.userName}</span>
          </div>
        ))}
      </div>

      {/* FULL SCREEN VIEWER */}
      {openViewer && (
        <StoryViewer
          stories={stories}
          startIndex={startIndex}
          onClose={() => setOpenViewer(false)}
        />
      )}
    </>
  );
};

export default Stories;
