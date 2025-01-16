import React from 'react';

function Profile_TagList({ tags }) {
  return (
    <div>
      <h3 className="text-gray-500 text-sm font-bold mb-2">TAG</h3>
      <ul>
        {tags.map((tag, index) => (
          <li
            key={index}
            className="mb-2 p-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile_TagList;
