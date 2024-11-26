import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import LineChart from '../components/LineChart';
import Chatbot from '../components/Chatbot';
import QuestionTypeTable from '../components/QuestionTypeTable';
import { useNavigate } from 'react-router-dom';
import {
  fetchEightTests,
  fetchCorrectQuestionCounts,
  fetchLastTest,
} from '../api/questionsApi';

function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState([{ x: "No Data", y: 0 }]);
  const [correctQuestionCounts, setCorrectQuestionCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('문제풀이');
  const [lastTestData, setLastTestData] = useState(null);

  const fileInputRef = useRef(null);

  // 최근 시험 데이터 로드
  useEffect(() => {
    const loadRecentTests = async () => {
      if (!user?.userId) return;

      try {
        const tests = await fetchEightTests(user.userId);
        if (tests && tests.length > 0) {
          const chartData = tests
            .sort((a, b) => a.id - b.id)
            .map((test) => ({
              x: test.id,
              y: parseInt(test.score),
              label: test.yearAndMonth,
            }));
          setChartData(chartData);
        }
      } catch (error) {
        console.error("최근 8개의 시험 기록 로드 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentTests();
  }, [user]);

  // 마지막 시험 데이터 로드
  useEffect(() => {
    const loadLastTest = async () => {
      if (!user?.userId) return;

      try {
        const lastTest = await fetchLastTest(user.userId);
        setLastTestData(lastTest);
      } catch (error) {
        console.error("마지막 시험 데이터 로드 중 오류:", error);
      }
    };

    loadLastTest();
  }, [user]);

  // 맞은 문제 유형 데이터 로드
  useEffect(() => {
    const loadCorrectQuestionCounts = async () => {
      if (!user?.userId || !lastTestData?.id) return;

      try {
        const counts = await fetchCorrectQuestionCounts(
          lastTestData.id,
          user.userId,
          lastTestData.yearAndMonth
        );
        setCorrectQuestionCounts(counts);
      } catch (error) {
        console.error("맞은 문제 유형 로드 중 오류:", error);
      }
    };

    loadCorrectQuestionCounts();
  }, [user, lastTestData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("업로드된 파일:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExamClick = (year, month) => {
    navigate(`/questions/${year.slice(2)}/${month}`);
  };

  const handleSolutionClick = (year, month) => {
    navigate(`/solutions/${year.slice(2)}/${month}`);
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
        <TopNav isAuthenticated={isAuthenticated} user={user} />
        <Box textAlign="center">
          {isAuthenticated ? (
            <div className="content-area">
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 1,
                  mx: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: '#e0e0e0',
                      borderRadius: '3px 0 0 3px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                    }}
                  >
                    <LineChart
                      data={[
                        {
                          id: 'test',
                          data: chartData,
                        },
                      ]}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: '#d0d0d0',
                      borderRadius: '0 3px 3px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QuestionTypeTable correctQuestionCounts={correctQuestionCounts} />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 1,
                  mx: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: '#e0e0e0',
                      borderRadius: '3px 0 0 3px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                    }}
                  >
                    <YearSelectionTable
                      handleFileChange={handleFileChange}
                      fileInputRef={fileInputRef}
                      selectedCategory={selectedCategory}
                      handleCategoryChange={handleCategoryChange}
                      onExamClick={
                        selectedCategory === '문제풀이'
                          ? handleExamClick
                          : handleSolutionClick
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: '#d0d0d0',
                      borderRadius: '0 3px 3px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Chatbot />
                  </Box>
                </Box>
              </Box>
            </div>
          ) : (
            <>
              <Typography variant="h3" gutterBottom>
                환영합니다!
              </Typography>
              <Typography variant="body1">로그인 후 이용해주세요!</Typography>
            </>
          )}
        </Box>

        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
