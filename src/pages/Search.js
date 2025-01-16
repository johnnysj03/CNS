import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [searchId, setSearchId] = useState(''); // ID 검색 입력값
  const [searchTag, setSearchTag] = useState(''); // 태그 검색 입력값
  const [users, setUsers] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const navigate = useNavigate(); // 프로필 페이지로 이동하기 위한 훅

  // 검색 API 호출 함수
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchId) params.user_id = searchId;
      if (searchTag) params.tag = searchTag;

      const response = await axios.get('http://172.10.7.49:5000/api/users', { params });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // 검색 버튼 클릭 시 호출
  const handleSearch = () => {
    fetchUsers();
  };

  // 프로필 클릭 시 프로필 페이지로 이동
  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">User Search</h1>

      {/* 검색 필드 */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="사용자 ID 검색"
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="태그 검색"
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
        <button
          className="w-full p-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {/* 검색 결과 */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-gray-500 text-center">검색 중...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 border-b last:border-none hover:bg-gray-100 rounded-lg transition cursor-pointer"
              onClick={() => handleProfileClick(user.id)} // 클릭 시 프로필로 이동
            >
              <div className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden shadow-md bg-gray-300">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex justify-center items-center text-white text-lg font-bold">
                    {user.name[0].toUpperCase()} {/* 이름의 첫 글자 */}
                  </div>
                )}
              </div>
              <div className="ml-6 text-lg font-medium text-gray-800">
                {user.name}
              </div>
              <div className="ml-4 text-sm text-gray-500">
              {Array.isArray(user.tags) && user.tags.length > 0
                ? user.tags.join(', ')
                : 'No Tags'}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
