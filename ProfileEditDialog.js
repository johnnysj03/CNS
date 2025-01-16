import React, { useState, useEffect } from 'react';

function ProfileEditDialog({ onClose, onSave, initialBio = '', initialTags = '', initialImage = null }) {
  const [bio, setBio] = useState(initialBio);
  const [tags, setTags] = useState(initialTags);
  const [image, setImage] = useState(initialImage);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');

  // 이미지 URL 생성 및 정리
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const validateInputs = () => {
    if (bio.length > 500) {
      setError('자기소개는 500자를 초과할 수 없습니다.');
      return false;
    }

    const tagList = tags.split(',').map(tag => tag.trim());
    if (tagList.some(tag => tag.length > 20)) {
      setError('각 관심사는 20자를 초과할 수 없습니다.');
      return false;
    }

    if (tagList.length > 10) {
      setError('관심사는 최대 10개까지만 입력할 수 있습니다.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInputs()) {
      return;
    }

    const profileData = {
      bio,
      tags: tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      image: image,
    };

    onSave(profileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">프로필 편집</h2>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center shadow-sm">
            {error}
          </div>
        )}

        {/* 자기소개 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">자기 소개 *</label>
          <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="자기 소개를 입력하세요"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setError('');
            }}
            maxLength={500}
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">{bio.length}/500자</p>
        </div>

        {/* 관심사 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">관심사</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="관심사를 콤마로 구분하여 입력하세요"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setError('');
            }}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">프로필 이미지</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 5 * 1024 * 1024) {
                setError('이미지 크기는 5MB를 초과할 수 없습니다.');
                return;
              }
              setImage(file);
              setError('');
            }}
          />
          {imageUrl && (
            <div className="mt-4 flex justify-center">
              <img
                src={imageUrl}
                alt="프로필 미리보기"
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditDialog;
