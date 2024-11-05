// PrivateRoute.js
import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
