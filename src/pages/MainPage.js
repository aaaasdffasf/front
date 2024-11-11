// src/pages/MainPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import DashboardMenu from '../components/DashboardMenu';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import { useNavigate } from 'react-router-dom';
import useQuestionStorage from '../hooks/useQuestionStorage'; // Custom hook import

function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  
  const { clearStorageData } = useQuestionStorage(); // Using the custom hook for storage clearing

  // handleExamClick function definition to reset progress and navigate
  const handleExamClick = (year, month) => {
    clearStorageData(); // Clear storage data when a new exam is started
    navigate(`/questions/${year.slice(2)}/${month}`); // Navigate to the questions page with year and month
  };

  const historyData = [
    { year: '2024', date: '2024-10-15', examInfo: '2024년 9월 시험' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 8월 시험' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
      setIsModalOpen(!isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopNav />
        <Box sx={{ mt: 2, ml: 3 }}>
          <DashboardMenu />
        </Box>
        <Container maxWidth="md" sx={{ mt: 4, ml: 2 }}>
          <Box textAlign="center" mt={4}>
            {isAuthenticated ? (
              <>
                <Typography variant="h3" gutterBottom>
                  안녕하세요, {user?.userId || '사용자'}님!
                </Typography>
                <Typography variant="body1">
                  Memo에 오신 것을 환영합니다. 아래에서 새로운 메모를 작성하거나 기록을 관리해보세요!
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h3" gutterBottom>
                  환영합니다!
                </Typography>
                <Typography variant="body1">
                  Memo에 오신 것을 환영합니다. 로그인하거나 회원가입을 통해 더 많은 기능을 이용해보세요!
                </Typography>
              </>
            )}
          </Box>

          {/* Show YearSelectionTable only if authenticated */}
          {isAuthenticated && (
            <YearSelectionTable
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              filteredData={filteredData}
              onExamClick={handleExamClick} // Passing handleExamClick to YearSelectionTable
            />
          )}
        </Container>
        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
