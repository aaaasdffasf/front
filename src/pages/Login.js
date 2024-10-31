// Login.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext'; // AuthContext 가져오기

function Login() {
  const [userId, setuserId] = useState('');
  const [userPw, setuserPw] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // AuthContext에서 login 함수와 isAuthenticated 상태 가져오기
  const { login, isAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // AuthContext의 login 함수 호출
      await login({ userId, userPw });
      setMessage('로그인에 성공하였습니다.');
    } catch (error) {
      console.error('로그인 실패:', error.message);
      setMessage('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  // 로그인 상태가 변경되면 메인 페이지로 이동
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // 메인 페이지로 이동
    }
  }, [isAuthenticated, navigate]);

  const handleSignupNavigation = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          로그인
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="아이디"
              variant="outlined"
              value={userId}
              onChange={(e) => setuserId(e.target.value)}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={userPw}
              onChange={(e) => setuserPw(e.target.value)}
              required
            />
          </Box>
          <Box textAlign="center" mb={2}>
            <Button type="submit" variant="contained" color="primary" size="large">
              로그인
            </Button>
          </Box>
        </form>
        {message && (
          <Box mt={3}>
            <Alert severity={message.includes('성공') ? 'success' : 'error'}>{message}</Alert>
          </Box>
        )}
        <Box textAlign="center" mt={2}>
          <Button variant="text" color="secondary" onClick={handleSignupNavigation}>
            회원가입으로 이동
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
