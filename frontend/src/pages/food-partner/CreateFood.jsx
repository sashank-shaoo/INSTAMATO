import React, { useState, useRef } from "react";
import "./../../styles/foodItem/CreateFood.css";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../../context/FlashContext";

const CreateFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    video: null,
    name: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { showFlash } = useFlash();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setShowPreview(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const confirmFile = () => {
    setFormData({ ...formData, video: selectedFile });
    setShowPreview(false);
    setSelectedFile(null);
  };

  const cancelFile = () => {
    setSelectedFile(null);
    setShowPreview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.video) {
      showFlash("Please select a video file before submitting.", "error");
      return;
    }
    try {
      const data = new FormData();
      data.append("video", formData.video);
      data.append("name", formData.name);
      data.append("description", formData.description);
      await axios.post("/food", data);
      showFlash("Food item created successfully!", "success");
      navigate("/");
    } catch(error) {
      if(error.response.status === 401) {
        showFlash("Please login as a food partner", "error");
      }else{
        showFlash("Error on Creating food item", "error");
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="whole-page">
      <div className="create-food-container">
        <form className="create-food-form" onSubmit={handleSubmit}>
          <h1>Create Food Item</h1>

          <div className="form-group">
            <label>Video File:</label>
            {formData.video ? (
              <div className="file-selected">
                <div className="selected-file-info">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                      fill="currentColor"
                    />
                    <path
                      d="M8 15H16V17H8V15ZM8 11H16V13H8V11Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>
                    {formData.video.name} ({formatFileSize(formData.video.size)}
                    )
                  </span>
                </div>
                <button
                  type="button"
                  className="change-file-btn"
                  onClick={() => setFormData({ ...formData, video: null })}>
                  Change File
                </button>
              </div>
            ) : !showPreview ? (
              <div
                className={`file-drop-zone ${dragOver ? "drag-over" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current.click()}>
                <div className="drop-zone-content">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                      fill="currentColor"
                    />
                    <path
                      d="M8 15H16V17H8V15ZM8 11H16V13H8V11Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>Drag & drop a video file here or click to select</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="file-preview">
                <video
                  src={URL.createObjectURL(selectedFile)}
                  controls
                  className="preview-video"
                />
                <div className="file-info">
                  <p>
                    <strong>File:</strong> {selectedFile.name}
                  </p>
                  <p>
                    <strong>Size:</strong> {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div className="preview-buttons">
                  <button
                    type="button"
                    className="confirm-btn"
                    onClick={confirmFile}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelFile}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                        fill="currentColor"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter food description"
              required
            />
          </div>

          <button type="submit">Create Food</button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
