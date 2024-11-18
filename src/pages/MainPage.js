import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, ButtonGroup, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
//import DashboardMenu from '../components/DashboardMenu';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import { useNavigate } from 'react-router-dom';
import useQuestionStorage from '../hooks/useQuestionStorage';
import ProblemCard from '../components/Problem_Card';

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
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/questions/${year.slice(2)}/${month}`);
  };
  
  const handleSolutionClick = (year, month) => {
    clearStorageData();
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/solutions/${year.slice(2)}/${month}`);
  };
  

  const historyData = [
    { year: '2024', date: '2024-11-14', examInfo: '2024년 수능' },
    { year: '2024', date: '2024-09-04', examInfo: '2024년 9월 모의고사' },
    { year: '2024', date: '2024-06-04', examInfo: '2024년 6월 모의고사' },
    { year: '2024', date: '2024-03-28', examInfo: '2024년 3월 모의고사' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 9월 시험' },
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
          <Box textAlign="center" >
            {isAuthenticated ? (
              <>
                <div className="content-area">
            <Box className="problem-card-container">
              <ProblemCard />
            </Box>
            <Box
              sx={{
                //height: '50vh', // 높이를 화면의 50vh로 설정
                flex: 1, // 남은 공간을 모두 차지하도록 설정
                backgroundColor: 'white', // 내용의 가독성을 위해 흰색 배경 설정
                borderRadius: 3,
                textAlign: 'center',
                p: 1, // 패딩을 줄여 여백을 줄임
                mx: 2, // 좌우 여백 추가
                //my: 2, // 상하 여백 추가
                position: 'relative', // 작은 박스를 위한 상대 위치 설정
              }}
            >
              {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
              <Box
                sx={{
                  //marginTop: '10px', // 작은 박스 아래로 밀어내기 위해 여백 추가
                  height: '430px', // 남은 공간을 모두 차지하도록 높이 계산
                  display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                  flexDirection: 'row', // 두 개의 박스를 가로로 배치
                  borderRadius: 3, // 둥근 모서리
                  overflow: 'hidden', // 내용이 넘치는 것을 방지
                }}
              >
                {/* 첫 번째 박스 */}
                <Box
                  sx={{
                    flex: 1, // 남은 공간을 모두 차지하도록 설정
                    backgroundColor: '#e0e0e0', // 첫 번째 박스의 배경색
                    borderRadius: '3px 0 0 3px', // 둥근 모서리
                    display: 'flex',
                    flexDirection: 'column', // 세로 방향으로 배치
                    justifyContent: 'center', // 수직 중앙 정렬
                    alignItems: 'center', // 수평 중앙 정렬
                    position: 'relative', // 상대 위치 설정
                    p: 1, // 패딩 추가
                  }}
                >
                </Box>

                {/* 두 번째 박스 */}
                <Box
                  sx={{
                    flex: 1, // 남은 공간을 모두 차지하도록 설정
                    backgroundColor: '#d0d0d0', // 두 번째 박스의 배경색
                    borderRadius: '0 3px 3px 0', // 둥근 모서리
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                //height: '50vh', // 높이를 화면의 50vh로 설정
                //flex: 1, // 남은 공간을 모두 차지하도록 설정
                backgroundColor: 'white', // 내용의 가독성을 위해 흰색 배경 설정
                borderRadius: 3,
                textAlign: 'center',
                p: 1, // 패딩을 줄여 여백을 줄임
                mx: 2, // 좌우 여백 추가
                //my: 2, // 상하 여백 추가
                position: 'relative', // 작은 박스를 위한 상대 위치 설정
              }}
            >
              {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
              <Box
                sx={{
                  //flex: 1,
                  height: '275px', // 남은 공간을 모두 차지하도록 높이 계산
                  display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                  flexDirection: 'row', // 두 개의 박스를 가로로 배치
                  borderRadius: 3, // 둥근 모서리
                  overflow: 'hidden', // 내용이 넘치는 것을 방지
                }}
              >
                {/* 첫 번째 박스 */}
                <Box
                  sx={{
                    flex: 1, // 남은 공간을 모두 차지하도록 설정
                    backgroundColor: '#e0e0e0', // 첫 번째 박스의 배경색
                    borderRadius: '3px 0 0 3px', // 둥근 모서리
                    display: 'flex',
                    flexDirection: 'column', // 세로 방향으로 배치
                    justifyContent: 'center', // 수직 중앙 정렬
                    alignItems: 'center', // 수평 중앙 정렬
                    position: 'relative', // 상대 위치 설정
                    p: 1, // 패딩 추가
                  }}
                >
                  {/* 카테고리 버튼 그룹 추가 */}
                  {isAuthenticated && (
                    <Box textAlign="center" mb={1}>
                      <ButtonGroup>
                        <Button
                          variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
                          sx={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            minWidth: '60px',
                          }}
                          onClick={() => handleCategoryChange('문제풀이')}
                        >
                          문제풀이
                        </Button>
                        <Button
                          variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
                          sx={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            minWidth: '60px',
                          }}
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
                </Box>

                {/* 두 번째 박스 */}
                <Box
                  sx={{
                    flex: 1, // 남은 공간을 모두 차지하도록 설정
                    backgroundColor: '#d0d0d0', // 두 번째 박스의 배경색
                    borderRadius: '0 3px 3px 0', // 둥근 모서리
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  
                </Box>
              </Box>
            </Box>
          </div>
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
        
        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
