import React, { useEffect, useRef, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";

const SavedVideos = () => {
  const [videos, setVideos] = useState([]);
  const videoRef = useRef(new Map());
  const containerRef = useRef(null);
  const { showFlash } = useFlash();

  // Shuffle function (same as Home2)
  const shuffleVideos = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch saved videos
  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await axios.get("/user/profile/saved-reels");
        const foodList = response.data.foodItems.map((item) => ({
          id: item._id,
          name: item.name,
          videoUrl: item.video,
          description: item.description,
          foodPartner: item.foodPartner?._id,
          likesCount: item.likesCount || 0,
          bookMarkCount: item.bookMarkCount || 0,
        }));

        setVideos(shuffleVideos(foodList));
      } catch (error) {
        console.error("Error fetching saved videos:", error);
        if (error.response?.status === 404) {
          showFlash("No saved videos found", "info");
        } else {
          showFlash("Failed to fetch saved videos", "error");
        }
      }
    };

    fetchSavedVideos();
  }, [showFlash]);

  // Auto play/pause logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) videoElement.play().catch(() => {});
          else videoElement.pause();
        });
      },
      { threshold: 0.6 }
    );

    videoRef.current.forEach((video) => observer.observe(video));

    return () => {
      videoRef.current.forEach((video) => observer.unobserve(video));
      observer.disconnect();
    };
  }, [videos]);

  const setVideoRef = (id) => (el) => {
    if (!el) videoRef.current.delete(id);
    else videoRef.current.set(id, el);
  };

  const handleVideoClick = (id) => {
    const video = videoRef.current.get(id);
    if (video) video.paused ? video.play() : video.pause();
  };

  return (
    <div className="reels-container" ref={containerRef}>
      {videos.length === 0 ? (
        <p className="no-saved-msg">You haven’t saved any videos yet.</p>
      ) : (
        videos.map((item) => (
          <div key={item.id} className="reel-item">
            <video
              className="video"
              src={item.videoUrl}
              ref={setVideoRef(item.id)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onClick={() => handleVideoClick(item.id)}
            />

            <div className="overlay">
              <div className="overlay-bottom">
                <p className="name" title={item.name}>
                  {item.name}
                </p>
                <p className="description" title={item.description}>
                  {item.description}
                </p>
                <Link
                  to={`/food-partner/${item.foodPartner}`}
                  className="visit-button">
                  Visit Store
                </Link>
              </div>

              <div className="action-buttons">
                {/* Likes Count (read-only here) */}
                <div className="action-btn like-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon"
                    viewBox="0 0 48 48">
                    <path
                      fill="red"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8Z"
                    />
                  </svg>
                  <span className="count">{item.likesCount}</span>
                </div>

                {/* Save Count (read-only here) */}
                <div className="action-btn save-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FFD700"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="count">{item.bookMarkCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedVideos;
