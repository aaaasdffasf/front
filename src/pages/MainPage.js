import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, ButtonGroup, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import DashboardMenu from '../components/DashboardMenu';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import { useNavigate } from 'react-router-dom';
import useQuestionStorage from '../hooks/useQuestionStorage';

function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('문제풀이'); // 카테고리 상태 추가

  const { clearStorageData } = useQuestionStorage();

  const handleExamClick = (year, month) => {
    clearStorageData();
    navigate(`/questions/${year.slice(2)}/${month}`);
  };

  const handleSolutionClick = (year, month) => {
    clearStorageData();
    navigate(`/solutions/${year.slice(2)}/${month}`);
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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

          {/* 카테고리 버튼 그룹 추가 */}
          {isAuthenticated && (
            <Box textAlign="center" mt={2} mb={4}>
              <ButtonGroup>
                <Button
                  variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
                  onClick={() => handleCategoryChange('문제풀이')}
                >
                  문제풀이
                </Button>
                <Button
                  variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
                  onClick={() => handleCategoryChange('문제해설')}
                >
                  문제해설
                </Button>
              </ButtonGroup>
            </Box>
          )}

          {/* 선택된 카테고리에 따라 YearSelectionTable 표시 */}
          {isAuthenticated && (
            <YearSelectionTable
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              filteredData={filteredData}
              onExamClick={selectedCategory === '문제풀이' ? handleExamClick : handleSolutionClick}
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
