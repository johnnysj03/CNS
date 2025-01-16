import React, { useState, useEffect } from 'react';
import ProfileShowOff from './ProfileShowOff';
import ProfileEditDialog from './dialogs/ProfileEditDialog';
import UploadDialog from './dialogs/UploadDialog';
import FriendListDialog from './dialogs/FriendListDialog';
import axios from 'axios';

function ProfileHeader({ user, currentUser, onUpload = () => {}, onProfileUpdate = () => {} }) {
  const [isOwner, setIsOwner] = useState(false);
  const [friendStatus, setFriendStatus] = useState('none');
  const [friendList, setFriendList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modals, setModals] = useState({
    showShowOffModal: false,
    showEditModal: false,
    showUploadModal: false,
    showFriendListModal: false,
  });

  const DEFAULT_PROFILE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"%3E%3C/path%3E%3C/svg%3E';

  const axiosInstance = axios.create({
    baseURL: 'http://172.10.7.49:5000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // 프로필 소유자 확인
  useEffect(() => {
    const checkOwnership = () => {
      if (!currentUser || !user) return;

      // ID와 이름을 모두 확인
      const ownerStatus = 
        currentUser.user_id === user.name || 
        currentUser.id === user.user_id ||
        currentUser.name === user.name ||
        currentUser.id === user.id;

      setIsOwner(ownerStatus);

      if (!ownerStatus) {
        checkFriendStatus();
      }
    };

    checkOwnership();
  }, [currentUser, user]);

  // 친구 상태 확인
  const checkFriendStatus = async () => {
    if (!currentUser?.id || !user?.name) {
      console.error('Missing required data:', {
        sender_id: currentUser?.id,
        receiver_name: user?.name,
      });
      return;
    }
    try {
      console.log('Checking friend status with data:', {
        sender_id: currentUser.id,
        receiver_name: user.name,
      });
      const response = await axiosInstance.get('/friends/request/status', {
        params: {
          sender_id: currentUser.id,
          receiver_name: user.name
        }
      });

      if (response.data && response.data.status) {
        setFriendStatus(response.data.status);
      }
    } catch (error) {
      console.error('Failed to check friend status:', error);
      setFriendStatus('none');
    }
  };

  // 친구 목록 가져오기
  const fetchFriendList = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await axiosInstance.get(`/friends/${currentUser.id}`);
      if (response.data && Array.isArray(response.data.friends)) {
        setFriendList(response.data.friends);
      }
    } catch (error) {
      console.error('Failed to fetch friend list:', error);
      setFriendList([]);
    }
  };

  const handleFriendAction = async () => {
    if (!currentUser?.id || !user?.name) {
      console.error('Missing required data for friend action:', {
        user_id: currentUser?.id,
        friend_id: user?.name,
      });
      return;
    }
  
    try {
      console.log('Sending friend request with data:', {
        user_id: currentUser.id,
        friend_id: user.name,
      });
  
      // 친구 요청 보내기 (자동으로 수락 처리됨)
      const response = await axiosInstance.post('/friends/request', {
        user_id: currentUser.id,
        friend_id: user.name,
      });
  
      if (response.status === 201) {
        setFriendStatus('accepted');
        alert('친구 추가가 완료되었습니다.');
      }
    } catch (error) {
      console.error('Friend action failed:', error);
      alert(error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.');
    }
  };
  
  

  // 프로필 업데이트 처리
  const handleProfileUpdate = async (updatedProfile) => {
    if (!currentUser?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bio', updatedProfile.bio || '');
      formData.append('is_personal', updatedProfile.isPersonal || true); // 개인 프로필 여부
      formData.append('groups', updatedProfile.groups || ''); // 그룹 정보
      
      if (updatedProfile.image instanceof File) {
        formData.append('profile_image', updatedProfile.image);
      }
      
      if (updatedProfile.tags) {
        formData.append('tags', JSON.stringify(updatedProfile.tags));
      }

      const response = await axiosInstance.put(
        `/api/users/${currentUser.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.status === 200) {
        onProfileUpdate(response.data);
        toggleModal('showEditModal');
        alert('프로필이 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      alert(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    }
  };

  // 모달 토글
  const toggleModal = (modalName) => {
    if (modalName === 'showFriendListModal' && !modals.showFriendListModal) {
      fetchFriendList();
    }
    setModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  };

  // Loading state
  if (!user || !currentUser) {
    return (
      <div className="flex items-center justify-between mb-6 p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="ml-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6 p-6 bg-white rounded-xl shadow-md">
      {/* 프로필 정보 */}
      <div className="flex items-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md border border-gray-300">
          <img
            src={user.profileImage || DEFAULT_PROFILE_IMAGE}
            alt="프로필 사진"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = DEFAULT_PROFILE_IMAGE;
            }}
          />
        </div>
        <div className="ml-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.name || '기본 이름'}
          </h2>
          <p className="text-gray-500 mt-2">
            {user.intro || '자기소개를 입력하세요.'}
          </p>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex space-x-3">
        {isOwner ? (
          <>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition"
              onClick={() => toggleModal('showShowOffModal')}
            >
              자랑하기
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition"
              onClick={() => toggleModal('showUploadModal')}
            >
              업로드
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition"
              onClick={() => toggleModal('showFriendListModal')}
            >
              친구 목록
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition"
              onClick={() => toggleModal('showEditModal')}
            >
              프로필 편집
            </button>
          </>
        ) : (
          <>
            <button
              className={`px-4 py-2 rounded-lg shadow-sm transition ${
                friendStatus === 'accepted'
                  ? 'bg-green-500 text-white'
                  : friendStatus === 'pending'
                  ? 'bg-gray-400 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={handleFriendAction}
              disabled={friendStatus === 'pending'}
            >
              {friendStatus === 'accepted'
                ? '친구 ✓'
                : friendStatus === 'pending'
                ? '요청 중...'
                : '친구 추가'}
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 shadow-sm transition"
              onClick={() => toggleModal('showShowOffModal')}
            >
              자랑 보기
            </button>
          </>
        )}
      </div>

      {/* 모달 컴포넌트들 */}
      {modals.showShowOffModal && (
        <ProfileShowOff 
          onClose={() => toggleModal('showShowOffModal')} 
          currentUser={currentUser}
          user={user}
        />
      )}
      {modals.showEditModal && (
        <ProfileEditDialog
          onClose={() => toggleModal('showEditModal')}
          onSave={handleProfileUpdate}
          initialBio={user.intro || ''}
          initialTags={user.tags ? user.tags.join(', ') : ''}
          initialImage={user.profileImage}
        />
      )}
      {modals.showUploadModal && (
        <UploadDialog
          onClose={() => toggleModal('showUploadModal')}
          onSave={onUpload}
        />
      )}
      {modals.showFriendListModal && (
        <FriendListDialog 
          onClose={() => toggleModal('showFriendListModal')} 
          currentUserId={currentUser?.id} // currentUserId만 전달
        />
      )}
    </div>
  );
}

export default ProfileHeader;