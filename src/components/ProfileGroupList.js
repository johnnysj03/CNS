import React from 'react';

function Profile_GroupList({ groups }) {
  return (
    <div className="mb-6">
      <h3 className="text-gray-500 text-sm font-bold mb-2">Your GROUP</h3>
      <ul>
        {groups.map((group, index) => (
          <li
            key={index}
            className="flex items-center mb-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
          >
            <div className="bg-gray-300 rounded-full w-8 h-8 flex justify-center items-center text-sm font-bold text-white mr-2">
              {group[0]}
            </div>
            <span>{group}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile_GroupList;
