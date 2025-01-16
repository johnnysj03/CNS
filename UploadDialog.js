import React, { useState } from 'react';

const UploadDialog = ({ onClose = () => {}, onSave = () => {} }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (!date) {
      alert('날짜를 선택해주세요.');
      return;
    }

    try {
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        date,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        image, // 실제 파일 객체를 저장
      };
  
      onSave(newPost); // 파일 객체 포함
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('게시물 저장 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    const hasContent = title || content || date || tags || image;

    if (hasContent) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말로 닫으시겠습니까?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          게시물 업로드
        </h2>

        <div className="space-y-5">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="내용을 입력하세요"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              태그
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="태그를 콤마(,)로 구분하여 입력하세요"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleClose}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDialog;
