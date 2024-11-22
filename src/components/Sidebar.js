import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaBell, FaUser, FaQuestionCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import useQuestionStorage from '../hooks/useQuestionStorage';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext); // user 정보를 참조

  const { clearStorageData } = useQuestionStorage();

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    console.log(`로그인 before data (${user?.userId || user?.email || 'Unknown User'}):`, {
      currentQuestionIndex: localStorage.getItem('currentQuestionIndex'),
      elapsedTime: localStorage.getItem('elapsedTime'),
      answers: localStorage.getItem('answers'),
      lastSelectedYear: localStorage.getItem('lastSelectedYear'),
      lastSelectedMonth: localStorage.getItem('lastSelectedMonth'),
      lastSelectedNumber: localStorage.getItem('lastSelectedNumber'),
    });

    clearStorageData(); // 로컬 스토리지 데이터 초기화
    logout(); // AuthContext의 로그아웃 호출

    console.log(`로그인 after data (${user?.id || user?.userId || 'Unknown User'}):`, {
      currentQuestionIndex: localStorage.getItem('currentQuestionIndex'),
      elapsedTime: localStorage.getItem('elapsedTime'),
      answers: localStorage.getItem('answers'),
      lastSelectedYear: localStorage.getItem('lastSelectedYear'),
      lastSelectedMonth: localStorage.getItem('lastSelectedMonth'),
      lastSelectedNumber: localStorage.getItem('lastSelectedNumber'),
    });

    navigate('/'); // 메인 페이지로 이동
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  const [lastYear, setLastYear] = useState(localStorage.getItem('lastSelectedYear'));
  const [lastMonth, setLastMonth] = useState(localStorage.getItem('lastSelectedMonth'));
  

  useEffect(() => {
    const storedYear = localStorage.getItem('lastSelectedYear');
    const storedMonth = localStorage.getItem('lastSelectedMonth');

    setLastYear(storedYear);
    setLastMonth(storedMonth);
  }, [location]);

  const questionsPath = `/questions/${lastYear}/${lastMonth}`;
  const solutionsPath = `/solutions/${lastYear}/${lastMonth}`;
  const mistakePath = `/mistake/${lastYear}/${lastMonth}`;

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
