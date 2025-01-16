import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FriendListDialog({ onClose, currentUserId }) {
  const [friends, setFriends] = useState([]); // 친구 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 친구 목록을 가져오는 함수
  const fetchFriends = async () => {
    console.log('fetchFriends called'); // 함수 호출 로그
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://172.10.7.49:5000/friends/${currentUserId}`);
      console.log('Axios Request Successful:', response.status); // 요청 상태 로그 추가
      console.log('Fetched Friends Data:', response.data);
      
      if (response.data && response.data.friends) {
        const uniqueFriends = response.data.friends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f.friend_id === friend.friend_id)
        );
        setFriends(uniqueFriends); // 서버에서 가져온 친구 데이터 설정
      } else {
        setFriends([]); // 데이터가 없을 경우 빈 배열 설정
      }
    } catch (err) {
      console.error('Failed to fetch friend list:', err);
      setError('친구 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 친구 목록 가져오기
  useEffect(() => {
    console.log('useEffect called with currentUserId:', currentUserId);
    if (currentUserId) {
      console.log('Fetching friends for user:', currentUserId); // currentUserId 확인
      fetchFriends();
    }
  }, [currentUserId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        {/* 헤더 */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          친구 목록
        </h2>

        {/* 로딩 상태 */}
        {loading && <p className="text-center text-gray-500">로딩 중...</p>}

        {/* 에러 상태 */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 친구 목록 */}
        {!loading && !error && friends.length > 0 ? (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.friend_id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 font-medium text-center">
                  {friend.name || `User ${friend.friend_id}`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-500">친구 목록이 없습니다.</p>
          )
        )}

        {/* 닫기 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendListDialog;
