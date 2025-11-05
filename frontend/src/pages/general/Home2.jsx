import React, { useEffect, useRef, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";

const Home2 = () => {
  const [videos, setVideos] = useState([]);
  const [likedItems, setLikedItems] = useState(new Set());
  const [savedItems, setSavedItems] = useState(new Set());
  const [pendingSaves, setPendingSaves] = useState(new Set());
  const [pendingLikes, setPendingLikes] = useState(new Set());
  const videoRef = useRef(new Map());
  const containerRef = useRef(null);
  const { showFlash } = useFlash();
  //Shuffel video function for random video every time
  const shuffleVideo = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // show all videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/food");

        const foodList = response.data.foodItems.map((item) => ({
          id: item._id,
          name: item.name,
          videoUrl: item.video,
          description: item.description,
          foodPartner: item.foodPartner._id,
          likesCount: item.likesCount || 0,
          bookMarkCount: item.bookMarkCount || 0,
          commentsCount: 0,
        }));

        // Initialize likedItems set (if server returns user liked info)
        const likedSet = new Set(
          response.data.foodItems
            .filter((f) => f.isLikedByUser)
            .map((f) => f._id)
        );
        const savedSet = new Set(
          response.data.foodItems
            .filter((f) => f.isSavedByUser)
            .map((f) => f._id)
        );
        setLikedItems(likedSet);
        setSavedItems(savedSet);
        setVideos(shuffleVideo(foodList));
      } catch (error) {
        console.error("Error fetching videos:", error);
        if(error.response.status === 401) {
          showFlash("Please login to continue", "error");
        }else{
        showFlash("Error fetching videos", "error");
        }
      }
    };

    fetchVideos();
  }, [showFlash]);

  //  Auto play/pause videos when in view by gpt
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
          }
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

  //  Assign video refs dynamically by GPT
  const setVideoRef = (id) => (el) => {
    if (!el) videoRef.current.delete(id);
    else videoRef.current.set(id, el);
  };

  //++++++++ Like a video ++++++++++++++//
  const toggleLike = async (foodId) => {
    if (pendingLikes.has(foodId)) return;
    setPendingLikes((prev) => new Set(prev).add(foodId));

    // Optimistic UI for snappy feedback
    const currentlyLiked = likedItems.has(foodId);
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(foodId);
      else next.add(foodId);
      return next;
    });
    setVideos((prev) =>
      prev.map((v) =>
        v.id === foodId
          ? {
              ...v,
              likesCount: Math.max(0, v.likesCount + (currentlyLiked ? -1 : 1)),
            }
          : v
      )
    );

    try {
      const res = await axios.post(`/food/${foodId}/like`);
      const { liked, likesCount } = res.data;
      setLikedItems((prev) => {
        const next = new Set(prev);
        if (liked) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
      setVideos((prev) =>
        prev.map((v) =>
          v.id === foodId
            ? {
                ...v,
                likesCount:
                  typeof likesCount === "number" ? likesCount : v.likesCount,
              }
            : v
        )
      );
    } catch {
      // Revert optimistic on error
      setLikedItems((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.add(foodId);
        else next.delete(foodId);
        return next;
      });
      setVideos((prev) =>
        prev.map((v) =>
          v.id === foodId
            ? {
                ...v,
                likesCount: Math.max(
                  0,
                  v.likesCount + (currentlyLiked ? 1 : -1)
                ),
              }
            : v
        )
      );
      showFlash("Failed to update like", "error");
    } finally {
      setPendingLikes((prev) => {
        const next = new Set(prev);
        next.delete(foodId);
        return next;
      });
    }
  };

  //++++++++ Save a video ++++++++++++++//
  const toggleSave = async (foodId) => {
    if (pendingSaves.has(foodId)) return;
    setPendingSaves((prev) => new Set(prev).add(foodId));

    const currentlySaved = savedItems.has(foodId);
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (currentlySaved) next.delete(foodId);
      else next.add(foodId);
      return next;
    });

    setVideos((prev) =>
      prev.map((v) =>
        v.id === foodId
          ? {
              ...v,
              bookMarkCount: Math.max(
                0,
                v.bookMarkCount + (currentlySaved ? -1 : 1)
              ),
            }
          : v
      )
    );

    try {
      const res = await axios.post(`/food/${foodId}/save`);
      const { saved, bookMarkCount, message } = res.data;
      showFlash(message, saved ? "success" : "info");

      // update state
      setSavedItems((prev) => {
        const next = new Set(prev);
        if (saved) next.add(foodId);
        else next.delete(foodId);
        return next;
      });

      setVideos((prev) =>
        prev.map((v) => (v.id === foodId ? { ...v, bookMarkCount } : v))
      );
    } catch {
      showFlash("Failed to update save", "error");
    } finally {
      setPendingSaves((prev) => {
        const next = new Set(prev);
        next.delete(foodId);
        return next;
      });
    }
  };

  //++++++++ Handle video click ++++++++++++++//
  function handleVideoClick(id) {
    const video = videoRef.current.get(id);
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  return (
    <div className="reels-container" ref={containerRef}>
      {videos.map((item) => (
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
              {/* Like */}
              <button
                className={`action-btn like-btn ${
                  likedItems.has(item.id) ? "liked" : ""
                }`}
                onClick={() => toggleLike(item.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  viewBox="0 0 48 48">
                  <path
                    fill={likedItems.has(item.id) ? "red" : "none"}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8Z"
                  />
                </svg>
                <span className="count">{item.likesCount}</span>
              </button>

              {/* Comments */}
              <button className="action-btn comment-btn">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    fill="currentColor"
                  />
                </svg>
                <span className="count">{item.commentsCount}</span>
              </button>

              {/* Save */}
              <button
                className={`action-btn save-btn ${
                  savedItems.has(item.id) ? "saved" : ""
                }`}
                onClick={() => toggleSave(item.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={savedItems.has(item.id) ? "#FFD700" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span className="count">{item.bookMarkCount}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home2;
