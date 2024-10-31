// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정 함수
export const setupAxiosInterceptors = (logout, refreshAccessToken) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const success = await refreshAccessToken();

        if (success) {
          // 갱신 성공 시 Authorization 헤더에 새 토큰 추가 후 요청 재시도
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${localStorage.getItem('token')}`;
          console.log('갱신 성공');
          return axiosInstance(originalRequest);
        } else {
          logout(); // 갱신 실패 시 로그아웃
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
