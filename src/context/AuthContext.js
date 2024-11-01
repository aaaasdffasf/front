// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/authApi';
import axiosInstance, { setupAxiosInterceptors } from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getCurrentTimeInSeconds = () => Math.floor(Date.now() / 1000);

  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp > getCurrentTimeInSeconds();
    } catch (error) {
      console.error('토큰 디코딩 실패:', error.message);
      return false;
    }
  }, []);
  

  const [user, setUser] = useState(() => {
    const savedUserInfo = localStorage.getItem('user');
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { accessToken, refreshToken, user } = response;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('유효하지 않은 로그인 응답입니다.');
      }

      setUser(user);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setIsAuthenticated(true);
    } catch (error) {
      console.error('로그인 실패:', error.message);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      await apiSignup(userData);
    } catch (error) {
      console.error('회원가입 실패:', error.message);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
    setRefreshToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    console.log('사용자가 로그아웃 되었습니다');
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || !token) return false;
    try {
      const response = await axiosInstance.post('/refresh', {
        refreshToken,
        accessToken: token,
      });
  
      const { accessToken: newAccessToken, user } = response.data;
  
      console.log('새로운 액세스 토큰을 받아왔습니다.', newAccessToken);
      setToken(newAccessToken);
      localStorage.setItem('token', newAccessToken);
  
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('사용자 정보를 업데이트했습니다.', user);
      }
  
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('토큰 갱신 실패:', error.message);
      if (error.response && error.response.status === 401) {
        console.warn('RefreshToken이 만료되었습니다. 로그아웃 처리됩니다.');
      }
      logout();
      return false;
    }
  }, [refreshToken, token, logout]);
  

  useEffect(() => {
    setupAxiosInterceptors(logout, refreshAccessToken);

    const initializeAuth = () => {
      if (isTokenValid(token) && user) {
        setIsAuthenticated(true);
        console.log('사용자가 로그인 되었습니다.');
      } else {
        logout();
      }
    };
    initializeAuth();
  }, [token, user, logout, refreshAccessToken, isTokenValid]);

  // 액세스 토큰 만료 시간 추적 및 자동 갱신
  useEffect(() => {
    if (!token) return;

    const { exp } = jwtDecode(token);
    const timeUntilExpiry = exp - getCurrentTimeInSeconds();

    // 토큰이 만료되기 1분 전에 갱신 시도
    const timeoutId = setTimeout(() => {
      refreshAccessToken();
    }, (timeUntilExpiry - 60) * 1000);

    return () => clearTimeout(timeoutId);
  }, [token, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
