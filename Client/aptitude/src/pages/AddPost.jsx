import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate } from 'react-router-dom';

const AddPost = () => {
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
const Navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !category) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('category', category);
    if (image) formData.append('image', image); // image optional

    try {
      await axiosInstance.post(`${api}/clideal/addPost`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Post created successfully!');
      Navigate('/')
      setCaption('');
      setCategory('');
      setImage(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post.';
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="card shadow-sm border-0 p-4 rounded-4">
        <div className="d-flex align-items-center mb-3">
          
          <div>
            <h5 className="mb-0">Create Post</h5>
            <small className="text-muted">Share your thoughts</small>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="What's on your mind?"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="aptitude">Aptitude</option>
              <option value="code">Code</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
