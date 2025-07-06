import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProfile = () => {
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !role || !email) {
      toast.warn('⚠️ Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('email', email);
    if (image) formData.append('image', image); // image is optional

    try {
      await axiosInstance.post(`${api}/clideal/addProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Profile created successfully!');
      setName('');
      setRole('');
      setEmail('');
      setImage(null);
    } catch (err) {
      toast.error('❌ Failed to add profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="card mx-auto p-4 shadow rounded-4" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">👤 Create Your Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-center">
            <img
              src={image ? URL.createObjectURL(image) : '/noprofile.png'}
              alt="Preview"
              className="rounded-circle"
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #ccc' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              type="text"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
                <option value="">-- Select Category --</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="ui/ux">UI/UX</option>
              <option value="hr">HR</option>
            </select>
          </div>
            
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Profile Image (optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
