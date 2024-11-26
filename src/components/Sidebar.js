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
            홈
          </Link>
        </li>
      </ul>

      <h3 className="sidebar-title">Service</h3>
      <ul className="sidebar-section">
        <li className={isActive(questionsPath) ? 'active' : ''}>
          <Link to={questionsPath} className="sidebar-link">문제풀이</Link>
        </li>
        <li className={isActive(solutionsPath) ? 'active' : ''}>
          <Link to={solutionsPath} className="sidebar-link">문제해설</Link>
        </li>
        <li className={isActive(mistakePath) ? 'active' : ''}>
          <Link to={mistakePath} className="sidebar-link">오답노트</Link>
        </li>
        <li className={isActive('/analysis') ? 'active' : ''}>
          <Link to="/analysis" className="sidebar-link">비슷한 유형 문제풀기</Link>
        </li>
        <li className={isActive('/history') ? 'active' : ''}>
          <Link to="/history" className="sidebar-link">학습 기록</Link>
        </li>
      </ul>

      <h3 className="sidebar-title">계정</h3>
      <ul className="sidebar-section">
        <li className={isActive('/settings') ? 'active' : ''}>
          <Link to="/settings" className="sidebar-link"><FaUser className="sidebar-icon" /> 사용자 설정</Link>
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
