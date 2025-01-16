import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeSidebar from '../components/HomeSidebar';
import HomeRightPanel from '../components/HomeRightPanel';
import { useNavigate } from 'react-router-dom';
import CoffeeIcon from '../assets/buttons/ph_coffee-bold.svg';
import LoveIcon from '../assets/buttons/mingcute_love-line.svg';
import ChatIcon from '../assets/buttons/ph_chat-bold.svg';
import '../styles/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = 2;
  const navigate = useNavigate();
  const [buttonStates, setButtonStates] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const DEFAULT_PROFILE_IMAGE =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"%3E%3C/path%3E%3C/svg%3E';

  const BASE_URL = 'http://172.10.7.49:5000';

  const getFullImageUrl = (path) => {
    if (!path) return DEFAULT_PROFILE_IMAGE;
    if (path.startsWith('http') || path.startsWith('https')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://172.10.7.49:5000/posts/all', {
          params: { user_id: currentUserId },
        });
        setPosts(response.data.posts || []);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  const toggleButtonState = (postId, buttonKey) => {
    setButtonStates((prev) => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        [buttonKey]: !(prev[postId]?.[buttonKey] || false),
      },
    }));
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setComments([]); // 댓글 초기화
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, newComment]);
    setNewComment('');
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <aside className="lg:w-1/5 w-full bg-white shadow-lg p-6">
        <HomeSidebar />
      </aside>

      <main className="flex-1 bg-gray-50 mx-4 lg:mx-6 p-6">
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-item" onClick={() => handlePostClick(post)}>
              <div className="post-content-container">
                <div className="post-image-container">
                  <img
                    src={getFullImageUrl(post.image_url)}
                    alt={post.title}
                    className="post-image"
                  />
                </div>
                <div className="post-content">
                  <div className="post-header">
                    <img
                      src={getFullImageUrl(post.user_profile_image)}
                      alt={post.user_name}
                      className="profile-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${post.user_id}`);
                      }}
                    />
                    <div className="date-box">
                      <span className="month">
                        {new Date(post.date).toLocaleString('en-US', {
                          month: 'short',
                        }).toUpperCase()}
                      </span>
                      <span className="day">{new Date(post.date).getDate()}</span>
                    </div>
                    <h4 className="post-title">{post.title}</h4>
                  </div>
                  <div className="post-body">
                    <p>{post.content}</p>
                  </div>
                  <div className="post-footer">
                    <button
                      className="interaction-button"
                      style={{
                        backgroundColor: buttonStates[post.id]?.coffeeClicked ? '#f59e0b' : 'transparent',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleButtonState(post.id, 'coffeeClicked');
                      }}
                    >
                      <img src={CoffeeIcon} alt="커피" className="icon" />
                    </button>
                    <button
                      className="interaction-button"
                      style={{
                        backgroundColor: buttonStates[post.id]?.loveClicked ? '#ef4444' : 'transparent',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleButtonState(post.id, 'loveClicked');
                      }}
                    >
                      <img src={LoveIcon} alt="하트" className="icon" />
                    </button>
                    <button
                      className="interaction-button"
                      style={{
                        backgroundColor: buttonStates[post.id]?.chatClicked ? '#3b82f6' : 'transparent',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleButtonState(post.id, 'chatClicked');
                      }}
                    >
                      <img src={ChatIcon} alt="메시지" className="icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 게시물 상세 모달 */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
              >
                ✕
              </button>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <img
                    src={getFullImageUrl(selectedPost.image_url)}
                    alt={selectedPost.title}
                    className="w-full rounded-xl shadow-md"
                  />
                </div>

                <div className="lg:w-1/2">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedPost.title}</h4>
                  <p className="text-sm text-gray-500 mb-4">{selectedPost.date}</p>
                  <p className="text-gray-700 mb-4">{selectedPost.content}</p>
                </div>
              </div>

              {/* 댓글 섹션 */}
              <div className="mt-8">
                <h5 className="text-xl font-semibold text-gray-800 mb-4">댓글</h5>
                <ul className="space-y-4 max-h-60 overflow-y-auto">
                  {comments.map((comment, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                      {comment}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className="lg:w-1/5 w-full bg-white shadow-lg p-6">
        <HomeRightPanel />
      </aside>
    </div>
  );
}

export default Home;
