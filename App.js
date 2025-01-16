import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Header from './components/Header';
import { getCurrentUser, logout } from './utils/userService';

function App() {
  // 현재 로그인한 사용자 상태 관리
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // 애플리케이션 로드 시 현재 로그인된 사용자 설정
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setAuthStatus(true);
        } else {
          setAuthStatus(false);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setAuthStatus(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout(); // 사용자 로그아웃 처리
    setCurrentUser(null); // 상태 초기화
    setAuthStatus(false);
  };

  if (loading) {
    return <p>Loading...</p>; // 로딩 스피너 또는 기본 UI 표시
  }

  return (
    <Router>
      {/* Header는 로그인 상태일 때만 렌더링 */}
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        {/* 홈 화면 */}
        <Route
          path="/"
          element={isAuthenticated ? <Home currentUser={currentUser} /> : <Navigate to="/login" />}
        />
        {/* 로그인 화면 */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setCurrentUser={setCurrentUser} setAuthStatus={setAuthStatus} /> : <Navigate to="/" />}
        />
        {/* 현재 로그인한 사용자의 프로필 화면 */}
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile currentUser={currentUser} /> : <Navigate to="/login" />}
        />
        {/* 검색 화면 */}
        <Route
          path="/search"
          element={isAuthenticated ? <Search currentUser={currentUser} /> : <Navigate to="/login" />}
        />
        {/* 특정 사용자 프로필 화면 */}
        <Route
          path="/profile/:id"
          element={isAuthenticated ? <Profile currentUser={currentUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
