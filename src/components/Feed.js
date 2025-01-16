import React from 'react';

function Feed() {
  const posts = [
    { id: 1, user: 'User1', content: 'Hello, this is my first post!' },
    { id: 2, user: 'User2', content: 'What a wonderful day!' },
  ];

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 shadow rounded">
          <h2 className="font-bold text-lg">{post.user}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Feed;
