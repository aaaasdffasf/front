// Sidebar.js
import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaBell, FaUser, FaQuestionCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // AuthContext의 상태 및 함수 가져오기
  const { isAuthenticated, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    logout();
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  useEffect(() => {
    // 로그인 상태 변경 감지
  }, [isAuthenticated]); // isAuthenticated가 변경되면 리렌더링

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Quick Access</h3>
      <ul className="sidebar-section">
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/" className="sidebar-link">
            <FaHome className="sidebar-icon" />
            Dashboard
          </Link>
        </li>
      </ul>

      <h3 className="sidebar-title">Service</h3>
      <ul className="sidebar-section">
        <li className={isActive('/problems') ? 'active' : ''}>
          <Link to="/problems" className="sidebar-link">문제풀이 화면</Link>
        </li>
        <li className={isActive('/solutions') ? 'active' : ''}>
          <Link to="/solutions" className="sidebar-link">문제 해설 화면</Link>
        </li>
        <li className={isActive('/retry') ? 'active' : ''}>
          <Link to="/retry" className="sidebar-link">문제 다시 풀기 화면</Link>
        </li>
        <li className={isActive('/analysis') ? 'active' : ''}>
          <Link to="/analysis" className="sidebar-link">분석 or 피드백 화면</Link>
        </li>
        <li className={isActive('/records') ? 'active' : ''}>
          <Link to="/records" className="sidebar-link">학습 기록</Link>
        </li>
        <li className={isActive('/comparison') ? 'active' : ''}>
          <Link to="/comparison" className="sidebar-link">친구와 성적 비교</Link>
        </li>
        <li className={isActive('/etc') ? 'active' : ''}>
          <Link to="/etc" className="sidebar-link">기타</Link>
        </li>
      </ul>

      <h3 className="sidebar-title">계정</h3>
      <ul className="sidebar-section">
        <li className={isActive('/alerts') ? 'active' : ''}>
          <Link to="/alerts" className="sidebar-link"><FaBell className="sidebar-icon" /> 알림</Link>
        </li>
        <li className={isActive('/settings') ? 'active' : ''}>
          <Link to="/settings" className="sidebar-link"><FaUser className="sidebar-icon" /> 사용자 설정</Link>
        </li>
        <li className={isActive('/help') ? 'active' : ''}>
          <Link to="/help" className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> 도움말</Link>
        </li>
      </ul>

      {/* 로그인/로그아웃 버튼 */}
      <div className="logout-section">
        {isAuthenticated ? (
          <button className="logout-button" onClick={handleLogoutClick}>
            <FaSignOutAlt className="sidebar-icon" /> 로그아웃
          </button>
        ) : (
          <button className="logout-button" onClick={handleLoginClick}>
            <FaSignInAlt className="sidebar-icon" /> 로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
