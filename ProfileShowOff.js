import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileShowOff({ onClose, currentUser, user }) {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    image: null,
    title: '',
  });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // 디버깅을 위한 로그
    console.log('ProfileShowOff - Current User:', currentUser);
    console.log('ProfileShowOff - Profile User:', user);

    // 프로필 소유자 확인 로직 수정
    const checkOwnerStatus = () => {
      if (currentUser?.user_id && user?.name) {
        const ownerStatus = currentUser.user_id === user.name;
        console.log('Is Owner Status:', ownerStatus,
          'currentUser.user_id:', currentUser.user_id,
          'user.name:', user.name);
        setIsOwner(ownerStatus);
      } else {
        setIsOwner(false);
      }
    };

    checkOwnerStatus();

    // 기존 자랑 목록 가져오기
    async function fetchAchievements() {
      if (!user?.id) return;
      try {
        const response = await axios.get(`http://172.10.7.49:5000/api/users/${user.id}/achievements`);
        setAchievements(response.data.achievements || []);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      }
    }

    fetchAchievements();
  }, [currentUser, user]);

  const handleUpload = async () => {
    if (!newAchievement.title) {
      alert('제목을 입력하세요!');
      return;
    }

    const formData = new FormData();
    formData.append('title', newAchievement.title);
    if (newAchievement.image) {
      formData.append('image', newAchievement.image);
    }

    try {
      const response = await axios.post('http://172.10.7.49:5000/api/achievements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAchievements([...achievements, response.data.achievement]);
      setNewAchievement({ image: null, title: '' });
    } catch (error) {
      console.error('Achievement upload failed:', error);
      alert('업로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const defaultImage = '/images/default-achievement.png';  // 기본 이미지 경로 수정

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">자랑하기</h3>

        {/* 업로드 섹션 (내 프로필인 경우만 표시) */}
        {isOwner && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">새로운 자랑 추가</h4>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                className="block w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, image: e.target.files[0] })
                }
              />
              <input
                type="text"
                placeholder="제목 입력"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={newAchievement.title}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, title: e.target.value })
                }
              />
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                업로드
              </button>
            </div>
          </div>
        )}

        {/* 업로드된 자랑 목록 */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">자랑 목록</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {achievements.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
                  <img
                    src={item.image || defaultImage}
                    alt={item.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-center text-gray-600">{item.title}</p>
              </div>
            ))}
            {[...Array(Math.max(15 - achievements.length, 0))].map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full"
              >
                <span className="text-gray-300">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileShowOff;