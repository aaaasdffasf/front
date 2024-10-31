// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/authApi';
import axiosInstance, { setupAxiosInterceptors } from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // 로그인 함수
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { accessToken, refreshToken, user } = response;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('유효하지 않은 로그인 응답입니다.');
      }

      const userInfo = {
        userId: user.userId,
        email: user.email,
      };

      setUser(userInfo);
      setToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userInfo));

      setIsAuthenticated(true);
    } catch (error) {
      console.error('로그인 실패:', error.message);
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      await apiSignup(userData);
    } catch (error) {
      console.error('회원가입 실패:', error.message);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = useCallback(() => {
    // 모든 토큰 및 사용자 정보 삭제
    setUser(null);
    setToken('');
    setRefreshToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }, []);

  // 토큰 갱신 함수
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const response = await axiosInstance.post('/refresh', { refreshToken });
      const newAccessToken = response.data.token;
      setToken(newAccessToken);
      localStorage.setItem('token', newAccessToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('토큰 갱신 실패:', error.message);
      logout();
      return false;
    }
  }, [refreshToken, logout]);

  // 초기 로그인 상태 설정 및 인터셉터 초기화
  useEffect(() => {
    setupAxiosInterceptors(logout, refreshAccessToken); // 인터셉터에 logout과 refreshAccessToken 전달
    
    const initializeAuth = () => {
      const savedUserInfo = JSON.parse(localStorage.getItem('user'));
      if (token && savedUserInfo) {
        setUser(savedUserInfo);
        setIsAuthenticated(true);
        console.log('사용자가 로그인 되었습니다.');
      } else {
        logout();
      }
    };
    initializeAuth();
  }, [token, logout, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
