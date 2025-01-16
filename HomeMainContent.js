import React, { useState } from 'react';
import CoffeeIcon from '../assets/buttons/ph_coffee-bold.svg';
import LoveIcon from '../assets/buttons/mingcute_love-line.svg';
import ChatIcon from '../assets/buttons/ph_chat-bold.svg';

function HomeMainContent() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [buttonStates, setButtonStates] = useState({
    coffeeClicked: false,
    loveClicked: false,
    chatClicked: false,
  });

  const posts = [
    {
      id: 1,
      date: 'MAY 08',
      title: '프랑스 여행',
      description: '에펠탑 야경 정말 아름답다. 모두에게 프랑스 여행 추천!',
      image: 'https://via.placeholder.com/300x200',
      comments: ['대박 멋짐', '잘생겼네요!', '와우~ 패리 크라이너!! 멋진 걸~'],
      tags: ['여행', '프랑스', '에펠탑'],
    },
    {
      id: 2,
      date: 'JAN 17',
      title: 'Meta Korea',
      description: 'Meta Korea 관련 최신 소식.',
      image: 'https://via.placeholder.com/300x200',
      comments: ['최고네요!', 'Meta 정말 빠르네요.', '커피 한 잔 가능할까요?'],
      tags: ['기술', 'Meta'],
    },
  ];

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setComments((prevComments) => [...prevComments, newComment]);
    setNewComment('');
  };

  const toggleButtonState = (buttonKey) => {
    setButtonStates((prevStates) => ({
      ...prevStates,
      [buttonKey]: !prevStates[buttonKey],
    }));
  };

  return (
    <main className="main-content bg-gray-50 p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* 피드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition transform hover:scale-105 cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={post.image}
              alt={post.title}
              className="rounded-xl w-full h-40 object-cover mb-4"
            />
            <div>
              <div className="text-blue-600 text-xs font-semibold mb-1">{post.date}</div>
              <h4 className="font-bold text-lg text-gray-800">{post.title}</h4>
              <p className="text-gray-600 text-sm mt-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} // 배경 클릭 시 모달 닫기
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()} // 내부 클릭은 이벤트 전파 방지
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ✖
            </button>
            <div className="flex flex-col lg:flex-row">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="rounded-lg w-full lg:w-1/3 h-auto lg:mr-6 mb-4 lg:mb-0"
              />
              <div>
                <h4 className="text-2xl font-bold text-gray-800">{selectedPost.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{selectedPost.date}</p>
                <p className="text-gray-700">{selectedPost.description}</p>
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800">Tags:</h5>
                  <ul className="space-x-2">
                    {selectedPost.tags.map((tag, index) => (
                      <li key={index} className="inline-block text-blue-500">
                        #{tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-around mt-8 space-x-4">
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition transform ${
                  buttonStates.coffeeClicked ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => toggleButtonState('coffeeClicked')}
              >
                <img src={CoffeeIcon} alt="커피" className="w-6 h-6" />
              </button>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition transform ${
                  buttonStates.loveClicked ? 'bg-red-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => toggleButtonState('loveClicked')}
              >
                <img src={LoveIcon} alt="사랑" className="w-6 h-6" />
              </button>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition transform ${
                  buttonStates.chatClicked ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => toggleButtonState('chatClicked')}
              >
                <img src={ChatIcon} alt="채팅" className="w-6 h-6" />
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-10">
              <h5 className="text-xl font-semibold text-gray-800 mb-4">댓글</h5>
              <ul className="space-y-4">
                {comments.map((comment, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-xl shadow-sm text-gray-700">
                    {comment}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default HomeMainContent;
