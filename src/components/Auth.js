import React, { useState } from 'react';
import {
  getUser,
  saveUser,
  setCurrentUser,
} from '../utils/userService';

function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = () => {
    if (isRegister) {
      // 회원가입 로직
      const existingUser = getUser(username);
      if (existingUser) {
        alert('이미 존재하는 사용자입니다.');
      } else {
        const newUser = { username, password, profileInfo: { intro: '' } };
        saveUser(newUser);
        alert('회원가입 완료!');
      }
    } else {
      // 로그인 로직
      const user = getUser(username);
      if (user && user.password === password) {
        alert('로그인 성공!');
        setCurrentUser(username); // 현재 사용자 설정
        onLogin(user);
      } else {
        alert('잘못된 사용자명 또는 비밀번호입니다.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? '회원가입' : '로그인'}</h2>
      <input
        type="text"
        placeholder="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isRegister ? '회원가입' : '로그인'}
      </button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? '로그인으로 전환' : '회원가입으로 전환'}
      </button>
    </div>
  );
}

export default Auth;
