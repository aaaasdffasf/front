// authApi.js
import axiosInstance from './axiosInstance';

// 회원가입 API 호출 함수
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그인 API 호출 함수
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    console.log('로그인 API 응답:', response.data); // 응답 데이터 출력
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user,
    };
  } catch (error) {
    console.error('로그인 API 요청 실패:', error.response?.data || error.message);
    throw new Error('로그인에 실패했습니다.');
  }
};
