import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileGroupList from '../components/ProfileGroupList';
import ProfileTagList from '../components/ProfileTagList';
import PostList from '../components/PostList';
import CoffeeIcon from '../assets/buttons/ph_coffee-bold.svg';
import LoveIcon from '../assets/buttons/mingcute_love-line.svg';
import ChatIcon from '../assets/buttons/ph_chat-bold.svg';
import axios from 'axios';

function Profile({ currentUser }) {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState({
    name: '',
    intro: 'No introduction provided',
    profileImage: null,
    tags: [],
    groups: [],
    user_id: ''
  });
  const [uploads, setUploads] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [buttonStates, setButtonStates] = useState({
    coffeeClicked: false,
    loveClicked: false,
    chatClicked: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      setError(null);
  
      const profileId = id || currentUser?.id;
  
      if (!profileId) {
        setError('유효한 사용자 ID가 없습니다.');
        setLoading(false);
        return;
      }
  
      try {
        // 프로필 정보 요청
        const profileResponse = await axios.get(`http://172.10.7.49:5000/api/users/${profileId}/profile`);
        const profileData = {
          id: profileResponse.data.id,
          user_id: profileResponse.data.user_id,
          name: profileResponse.data.name || '이름 없음',
          intro: profileResponse.data.bio || '자기소개가 없습니다.',
          profileImage: profileResponse.data.profile_image || null,
          tags: Array.isArray(profileResponse.data.tags) ? profileResponse.data.tags : [],
          groups: profileResponse.data.groups ? profileResponse.data.groups.split(',') : [],
        };
  
        setUserProfile(profileData);
  
        // 새로운 API를 사용하여 게시물 데이터 요청
        const postsResponse = await axios.get(`http://172.10.7.49:5000/api/users/${profileId}/posts`);
  
        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          setUploads(postsResponse.data.posts);
        } else {
          setUploads([]);
          console.warn('Invalid posts data:', postsResponse.data);
        }
  
        console.log('Fetched Posts Data:', postsResponse.data.posts);
      } catch (error) {
        console.error('Failed to fetch profile or posts:', error);
        setError('프로필 또는 게시물 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileAndPosts();
  }, [id, currentUser?.id]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const formData = new FormData();
      formData.append('bio', updatedProfile.bio || '');
      
      if (updatedProfile.image instanceof File) {
        formData.append('profile_image', updatedProfile.image);
      }
      
      if (updatedProfile.tags) {
        formData.append('tags', JSON.stringify(updatedProfile.tags));
      }

      await axios.put(
        `http://172.10.7.49:5000/api/users/${currentUser.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setUserProfile(prev => ({
        ...prev,
        intro: updatedProfile.bio,
        tags: updatedProfile.tags,
        profileImage: updatedProfile.image instanceof File
          ? URL.createObjectURL(updatedProfile.image)
          : updatedProfile.image,
      }));
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleUpload = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append('title', newPost.title || '');
      formData.append('content', newPost.content || '');
      
      if (newPost.image) {
        formData.append('image', newPost.image);
      }
      
      formData.append('tags', JSON.stringify(newPost.tags || []));
      formData.append('date', new Date().toISOString());
      
      const response = await axios.post('http://172.10.7.49:5000/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 게시물 업로드 후 해당 사용자의 게시물 목록을 다시 불러옴
      const postsResponse = await axios.get(`http://172.10.7.49:5000/api/users/${currentUser.id}/posts`);
      if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
        setUploads(postsResponse.data.posts);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드에 실패했습니다.');
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setComments([]);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setComments(prevComments => [...prevComments, newComment]);
    setNewComment('');
  };

  const toggleButtonState = (buttonKey) => {
    setButtonStates(prevStates => ({
      ...prevStates,
      [buttonKey]: !prevStates[buttonKey],
    }));
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">프로필 정보를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  const isOwnProfile = currentUser?.user_id === userProfile.name;

  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-r from-gray-100 to-gray-50 min-h-screen p-8 gap-6">
      {/* 왼쪽 사이드바 */}
      <aside className="lg:w-1/4 space-y-6 bg-white p-6 rounded-2xl shadow-xl">
        <ProfileGroupList groups={userProfile.groups} />
        <ProfileTagList tags={userProfile.tags} />
      </aside>
  
      {/* 메인 콘텐츠 */}
      <main className="lg:w-3/4 flex flex-col bg-white p-8 rounded-2xl shadow-xl">
        <ProfileHeader
          user={userProfile}
          currentUser={currentUser}
          currentUserInfo={currentUser}
          onUpload={handleUpload}
          onProfileUpdate={handleProfileUpdate}
          isOwnProfile={isOwnProfile}
        />
  
        {/* 게시물 섹션 */}
        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">게시물</h3>
          {uploads.length === 0 ? (
            <p className="text-gray-500 text-lg">업로드된 게시물이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {uploads.map((upload, index) => (
                <div
                  key={index}
                  className="cursor-pointer group hover:shadow-lg transition duration-300 ease-in-out rounded-lg overflow-hidden"
                  onClick={() => handlePostClick(upload)}
                >
                  {/* 이미지 섹션 */}
                  <div
                    className={`aspect-square rounded-lg overflow-hidden flex items-center justify-center ${
                      upload.image_url ? '' : 'bg-gray-200'
                    }`}
                  >
                    {upload.image_url ? (
                      <img
                        src={upload.image_url}
                        alt={`업로드-${index}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = '/default-post.png';
                        }}
                      />
                    ) : (
                      <p className="text-gray-500">이미지가 없습니다</p>
                    )}
                  </div>
                  {/* 텍스트 섹션 */}
                  <div className="p-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {upload.title || '제목 없음'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {upload.content || '내용 없음'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
  
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
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                닫기
              </button>
              <div className="mb-4">
                <img
                  src={selectedPost.image_url || '/default-post.png'}
                  alt={selectedPost.title || '게시물 이미지'}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/default-post.png';
                  }}
                />
              </div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">{selectedPost.title || '제목 없음'}</h4>
              <p className="text-gray-600 mb-6">{selectedPost.content || '내용 없음'}</p>
              <p className="text-sm text-gray-400">작성일: {new Date(selectedPost.date).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;