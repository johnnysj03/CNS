import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// SVG 파일을 import
import HomeIcon from '../assets/buttons/tdesign_home.svg';
import ProfileIcon from '../assets/buttons/pajamas_profile.svg';
import SearchIcon from '../assets/buttons/Search.svg';

function Header({ onLogout }) {
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // 부모(App.js)에서 전달받은 로그아웃 함수 호출
    }
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-500 text-white p-6 shadow-lg flex justify-between items-center rounded-b-2xl">
      {/* 로고 및 제목 */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold tracking-tight">My SNS</h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex items-center space-x-8">
        <Link to="/">
          <img
            src={HomeIcon}
            alt="Home"
            className="w-8 h-8 hover:opacity-80 transition duration-200 transform hover:scale-110"
          />
        </Link>
        <Link to="/profile">
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-8 h-8 hover:opacity-80 transition duration-200 transform hover:scale-110"
          />
        </Link>
        <Link to="/search">
          <img
            src={SearchIcon}
            alt="Search"
            className="w-8 h-8 hover:opacity-80 transition duration-200 transform hover:scale-110"
          />
        </Link>
      </nav>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="px-5 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
