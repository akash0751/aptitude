import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
  Modal,
} from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const YourProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPost, setEditedPost] = useState({});
  const api = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const fetchComments = async (postId) => {
    try {
      const res = await axiosInstance.get(`${api}/clideal/${postId}`);
      setPostComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch {
      toast.error('❌ Could not load comments');
    }
  };

  const toggleComments = (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));
    if (!isExpanded) fetchComments(postId);
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return toast.warn('⚠️ Comment cannot be empty');

    try {
      await axiosInstance.post(
        `${api}/clideal/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('✅ Comment added');
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch {
      toast.error('❌ Failed to add comment');
    }
  };

  const handleEdit = (post) => {
    setEditedPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = async () => {
    try {
      await axiosInstance.put(
        `${api}/clideal/updatePost/${editedPost._id}`,
        {
          caption: editedPost.caption,
          category: editedPost.category,
        }
      );
      toast.success('✅ Post updated successfully');
      setShowEditModal(false);
      // Refresh posts
      const postRes = await axiosInstance.get(`${api}/clideal/getPosts/${profile._id}`);
      setPosts(postRes.data.posts || []);
    } catch {
      toast.error('❌ Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axiosInstance.delete(`${api}/clideal/deletePost/${postId}`);
      toast.success('✅ Post deleted successfully');
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch {
      toast.error('❌ Failed to delete post');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return navigate('/login');

        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.id || decoded._id;
        if (!userId) return;

        const profileRes = await axiosInstance.get(`${api}/clideal/getProfile/${userId}`);
        setProfile(profileRes.data.profile);

        const postRes = await axiosInstance.get(`${api}/clideal/getPosts/${userId}`);
        setPosts(postRes.data.posts || []);
      } catch (err) {
        console.error('Error fetching profile data:', err.message);
        toast.error('❌ Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, api, token]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Row className="mb-4 justify-content-center">
        <Col xs="auto" className="text-center">
          <FaUserCircle size={100} className="text-secondary my-3" />
          <h3>{profile?.name || 'Name not available'}</h3>
          <p>{profile?.email}</p>
          <span className="text-muted">{profile?.role || 'No role specified'}</span>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4 className="mb-3">Your Posts</h4>
          {posts.length === 0 ? (
            <p className="text-muted">You haven’t posted anything yet.</p>
          ) : (
            <Row xs={1} sm={2} md={3} className="g-4">
              {posts.map((post) => (
                <Col key={post._id}>
                  <Card className="h-100 shadow-sm">
                    {post.image && (
                      <Card.Img
                        variant="top"
                        src={`${api}/uploads/${post.image}`}
                        alt="Post"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{post?.caption}</Card.Title>
                      <Card.Text>
                        <span className="badge bg-secondary">{post?.category}</span>
                      </Card.Text>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mb-2"
                        onClick={() => toggleComments(post._id)}
                      >
                        {expandedComments[post._id] ? 'Hide Comments' : 'View Comments'}
                      </Button>

                      {expandedComments[post._id] && (
                        <>
                          <div className="mt-2">
                            <strong>💬 Comments:</strong>
                            <div className="mt-2">
                              {postComments[post._id]?.length > 0 ? (
                                postComments[post._id].map((c, i) => (
                                  <div key={i} className="border rounded p-2 mb-2 bg-light">
                                    <strong>{c.commenter?.name || 'Anonymous'}</strong>: {c.text}
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted small">No comments yet.</p>
                              )}
                            </div>
                          </div>

                          <Form.Group className="mt-2">
                            <Form.Control
                              type="text"
                              placeholder="Add a comment..."
                              value={commentInputs[post._id] || ''}
                              onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                            />
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="mt-2 w-100"
                              onClick={() => submitComment(post._id)}
                            >
                              Post Comment
                            </Button>
                          </Form.Group>
                        </>
                      )}
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(post)}>
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post._id)}>
                        <FaTrash /> Delete
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                value={editedPost.caption || ''}
                onChange={(e) =>
                  setEditedPost((prev) => ({ ...prev, caption: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={editedPost.category || ''}
                onChange={(e) =>
                  setEditedPost((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePost}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default YourProfile;
