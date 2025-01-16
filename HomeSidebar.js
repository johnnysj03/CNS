import React from 'react';

function HomeSidebar() {
  const groups = ['Madcamp'];
  const friends = [
    '윤서진',
    '윤대한',
    '이현서',
    '박규현',
  ];

  return (
    <aside className="sidebar bg-gray-50 p-6 rounded-xl shadow-lg max-w-sm">
      {/* 그룹 섹션 */}
      <div className="group-section mb-8">
        <h3 className="text-base font-medium text-gray-700 mb-4">Your Groups</h3>
        <ul className="space-y-3">
          {groups.map((group, index) => (
            <li
              key={index}
              className="group-item flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">
                {group[0]}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {group}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 친구 섹션 */}
      <div className="friends-section">
        <h3 className="text-base font-medium text-gray-700 mb-4">Friends</h3>
        <ul className="space-y-3">
          {friends.map((friend, index) => (
            <li
              key={index}
              className="friend-item flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="bg-gray-300 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">
                {friend[0]}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {friend}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default HomeSidebar;
