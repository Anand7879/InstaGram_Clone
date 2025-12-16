import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORY_DURATION = 5000; // 5 seconds

const StoryViewer = ({ stories, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current < stories.length - 1) {
        setCurrent(current + 1);
      } else {
        onClose();
      }
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [current]);

  const next = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="story-viewer-backdrop">
      <div className="story-viewer">

        {/* PROGRESS BAR */}
        <div className="story-progress">
          {stories.map((_, i) => (
            <div
              key={i}
              className={`progress-bar ${i <= current ? "active" : ""}`}
            />
          ))}
        </div>

        {/* HEADER */}
        <div className="story-header">
          <div className="story-user">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${stories[current].user.userName}`}
              alt="user"
            />
            <span>{stories[current].user.userName}</span>
          </div>

          <button className="story-close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* STORY IMAGE */}
        <img
          src={stories[current].mediaUrl}
          className="story-media"
          alt="story"
        />

        {/* TAP AREAS */}
        <div className="story-tap left" onClick={prev}></div>
        <div className="story-tap right" onClick={next}></div>
      </div>
    </div>
  );
};

export default StoryViewer;
