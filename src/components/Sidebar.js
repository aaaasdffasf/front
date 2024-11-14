import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaBell, FaUser, FaQuestionCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    logout();
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  // 마지막 연도와 월, 문제 번호 정보를 가져오기 위한 변수
  const lastYear = localStorage.getItem('lastSelectedYear') || '24';
  const lastMonth = localStorage.getItem('lastSelectedMonth') || '9';
  const lastNumber = localStorage.getItem('lastSelectedNumber') || '18'; // 마지막으로 선택한 문제 번호를 가져옵니다

  const questionsPath = `/questions/${lastYear}/${lastMonth}`;
  const solutionsPath = `/solutions/${lastYear}/${lastMonth}/${lastNumber}`; // 동적으로 경로 설정
  const mistakePath = `/mistake/${lastYear}/${lastMonth}`; // 오답 노트 경로 설정

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
        <li className={isActive(questionsPath) ? 'active' : ''}>
          <Link to={questionsPath} className="sidebar-link">문제풀이 화면</Link>
        </li>
        <li className={isActive(solutionsPath) ? 'active' : ''}>
          <Link to={solutionsPath} className="sidebar-link">문제 해설 화면</Link>
        </li>
        <li className={isActive(mistakePath) ? 'active' : ''}>
          <Link to={mistakePath} className="sidebar-link">오답 노트 페이지 화면</Link>
        </li>
        <li className={isActive('/analysis') ? 'active' : ''}>
          <Link to="/analysis" className="sidebar-link">분석 or 피드백 화면</Link>
        </li>
        <li className={isActive('/history') ? 'active' : ''}>
          <Link to="/history" className="sidebar-link">학습 기록</Link>
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
