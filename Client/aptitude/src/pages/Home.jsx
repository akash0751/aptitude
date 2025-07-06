import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavIcons from '../components/NavIcons';
import axiosInstance from '../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faLock } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const [posts, setPosts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('aptitude');
  const [commentsInput, setCommentsInput] = useState({});
  const [replies, setReplies] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get(`${api}/clideal/getPost`);
      setPosts(res.data.post);
    } catch {
      toast.error('❌ Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosInstance.get(`${api}/clideal/${postId}`);
      setPostComments((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch comments", err);
      toast.error('❌ Could not load comments');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleComments = (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded) {
      fetchComments(postId);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentsInput((prev) => ({ ...prev, [postId]: value }));
  };

  const handleReplyChange = (postId, value) => {
    setReplies((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const comment = commentsInput[postId];
    if (!comment) return toast.warn('⚠️ Comment cannot be empty');

    try {
      await axiosInstance.post(`${api}/clideal/${postId}`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Comment added');
      setCommentsInput((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch {
      toast.error('❌ Failed to comment');
    }
  };

  const submitReply = async (postId) => {
    const message = replies[postId];
    if (!message) return toast.warn('⚠️ Reply cannot be empty');

    try {
      await axiosInstance.post(`${api}/clideal/${postId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Private reply sent');
      setReplies((prev) => ({ ...prev, [postId]: '' }));
    } catch {
      toast.error('❌ Failed to send reply');
    }
  };

  const filteredPosts = posts.filter(
    (p) => p.category?.toLowerCase() === filteredCategory.toLowerCase()
  );

  return (
    <>
      <NavIcons />
      <div className="container mt-4">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <h2 className="text-center mb-4">📝 Public Posts</h2>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className={`btn ${filteredCategory === 'aptitude' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilteredCategory('aptitude')}
          >
            Aptitude
          </button>
          <button
            className={`btn ${filteredCategory === 'code' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilteredCategory('code')}
          >
            Code
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="alert alert-info text-center">No posts in this category.</div>
        ) : (
          <div className="row row-cols-1 g-4">
            {filteredPosts.map((post) => (
              <div className="col" key={post._id}>
                <div className="card shadow rounded-4">
                  
                  {/* Author Section */}
                  <div className="card-header bg-white d-flex align-items-center gap-3 border-0">
                    <img
                      src={
                        post.author?.image
                          ? `${api}/profiles/${post.author.image}`
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Author"
                      className="rounded-circle"
                      style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                    />
                    <div>
                      <Link
                        to={`/`}
                        className="text-decoration-none fw-semibold"
                      >
                        {post.author?.name || "Unknown"}
                      </Link>
                      <div className="text-muted small">
                        {post.author?.role || "Member"}
                      </div>
                    </div>
                  </div>

                  {post.image && (
                    <img
                      src={`${api}/uploads/${post.image}`}
                      className="card-img-top"
                      alt="Post"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  )}

                  <div className={`card-body ${!post.image ? 'pt-4' : ''}`}>
                    <h5 className="card-title d-flex justify-content-between">
                      {post.caption}
                      <FontAwesomeIcon
                        icon={faComment}
                        className="text-primary"
                        role="button"
                        title="Toggle Comments"
                        onClick={() => toggleComments(post._id)}
                      />
                    </h5>

                    <p className="card-text">
                      <span className="badge bg-secondary">{post.category}</span>
                    </p>

                    {expandedComments[post._id] && (
                      <>
                        <div className="mt-3 mb-2">
                          <strong>💬 Comments:</strong>
                          <div className="mt-2">
                            {postComments[post._id] && postComments[post._id].length > 0 ? (
                              postComments[post._id].map((c, index) => (
                                <div key={index} className="border rounded p-2 mb-2 bg-light">
                                  <strong>{c.commenter?.name || "Anonymous"}</strong>: {c.text}
                                </div>
                              ))
                            ) : (
                              <div className="text-muted small">No comments yet</div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control mb-1"
                            placeholder="Write a public comment..."
                            value={commentsInput[post._id] || ''}
                            onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                          />
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={() => submitComment(post._id)}
                          >
                            Post Comment
                          </button>
                        </div>
                      </>
                    )}

                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Send private reply..."
                        value={replies[post._id] || ''}
                        onChange={(e) => handleReplyChange(post._id, e.target.value)}
                      />
                      <button
                        className="btn btn-outline-dark"
                        title="Send private reply"
                        onClick={() => submitReply(post._id)}
                      >
                        <FontAwesomeIcon icon={faLock} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
