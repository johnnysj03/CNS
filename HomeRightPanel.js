import React from 'react';

function HomeRightPanel() {
  const recommendations = [
    '김유림',
    '김정희',
    '박준호',
    '진예환',
  ];

  return (
    <aside className="right-panel bg-gray-50 p-6 rounded-xl shadow-lg max-w-sm">
      {/* 추천 헤더 */}
      <h3 className="text-gray-700 text-base font-semibold mb-6 border-b pb-2">
        Recommendations
      </h3>

      {/* 추천 목록 */}
      <ul className="space-y-4">
        {recommendations.map((recommend, index) => (
          <li
            key={index}
            className="flex items-center p-3 bg-white shadow-sm rounded-lg hover:shadow-md transition cursor-pointer"
          >
            {/* 아이콘 */}
            <div className="bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center text-sm font-bold text-white mr-4">
              {recommend[0]}
            </div>
            {/* 추천 텍스트 */}
            <span className="text-gray-800 text-sm font-medium">{recommend}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default HomeRightPanel;
