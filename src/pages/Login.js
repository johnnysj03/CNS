import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import

function Login({ setAuthStatus, setCurrentUser }) {
  const navigate = useNavigate();

  // 로그인 및 회원가입 상태 관리
  const [userInfo, setUserInfo] = useState({ username: '', password: '' }); // 로그인 상태
  const [signupInfo, setSignupInfo] = useState({ username: '', password: '' }); // 회원가입 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 회원가입 다이얼로그 열림 상태
  const [message, setMessage] = useState(''); // 사용자 메시지 표시

  // Axios 기본 설정 (필요시)
  const axiosInstance = axios.create({
    baseURL: 'http://172.10.7.49:5000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 로그인 처리 함수 (Axios 사용)
  const handleLogin = async () => {
    if (!userInfo.username || !userInfo.password) {
      setMessage('Please fill in both username and password.');
      return;
    }

    try {
      const response = await axiosInstance.post('/login', {
        username: userInfo.username,
        password: userInfo.password,
      });

      // 로그인 성공
      setMessage('Login Successful!');
      setAuthStatus(true); // 인증 상태 변경 (부모 컴포넌트에 전달)
      localStorage.setItem('currentUser', JSON.stringify(response.data)); // 현재 사용자 저장
      setCurrentUser(response.data);
      console.log('저장된 currentUser:', localStorage.getItem('currentUser')); // 저장된 데이터 확인
      navigate('/'); // 홈 화면으로 이동
    } catch (error) {
      // 로그인 실패
      setMessage(error.response?.data?.error || 'Login failed.');
      console.error('Login error:', error);
    }
  };

  // 회원가입 처리 함수 (Axios 사용)
  const handleSignup = async () => {
    if (!signupInfo.username || !signupInfo.password) {
      setMessage('Please fill in both username and password.');
      return;
    }

    try {
      const response = await axiosInstance.post('/register', {
        username: signupInfo.username,
        password: signupInfo.password,
      });

      // 회원가입 성공
      setMessage('Signup Successful!');
      setSignupInfo({ username: '', password: '' }); // 입력 초기화
      setIsDialogOpen(false); // 다이얼로그 닫기
    } catch (error) {
      // 회원가입 실패
      setMessage(error.response?.data?.error || 'Signup failed.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Welcome Back</h1>
      <div className="w-96 bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={userInfo.username}
          onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={userInfo.password}
          onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-gray-500 text-white py-3 rounded-lg mt-4 hover:bg-gray-600 transition"
        >
          Sign Up
        </button>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-lg rounded-xl w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={signupInfo.username}
              onChange={(e) => setSignupInfo({ ...signupInfo, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={signupInfo.password}
              onChange={(e) => setSignupInfo({ ...signupInfo, password: e.target.value })}
            />
            <button
              onClick={handleSignup}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="w-full bg-gray-500 text-white py-3 rounded-lg mt-4 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
