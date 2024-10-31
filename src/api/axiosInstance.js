// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정 함수
export const setupAxiosInterceptors = (logout) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axiosInstance.post('/refresh', { refreshToken });
          localStorage.setItem('token', data.newAccessToken);
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
          console.error('토큰 갱신 실패:', e.message);
          if (logout) {
            logout();
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
