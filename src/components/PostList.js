import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostList({ userId, onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://172.10.7.49:5000/api/users/${userId}/posts`);
        setPosts(response.data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPosts();
  }, [userId]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="cursor-pointer group hover:shadow-lg transition duration-300 ease-in-out rounded-lg overflow-hidden"
          onClick={() => onPostClick(post)}
        >
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={post.image_url || 'https://via.placeholder.com/150'}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
            />
          </div>
          <h4 className="mt-2 text-lg font-semibold text-gray-700">{post.title}</h4>
        </div>
      ))}
    </div>
  );
}

export default PostList;