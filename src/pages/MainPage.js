import React, { useContext, useEffect, useState } from 'react';
import { Typography, ButtonGroup, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import LineChart from '../components/LineChart';
import Chatbot from '../components/Chatbot';
import QuestionTypeTable from '../components/QuestionTypeTable';
import MainBox from '../components/MainBox';
import useQuestionStorage from '../hooks/useQuestionStorage';
import { fetchEightTests, fetchLastTest, fetchCorrectQuestionCounts } from '../api/questionsApi';
import './MainPage.css';

function MainPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [chartData, setChartData] = useState([{ x: "No Data", y: 0 }]);
  const [correctQuestionCounts, setCorrectQuestionCounts] = useState({});
  const [lastTestData, setLastTestData] = useState(null);
  const [activeContent, setActiveContent] = useState('LineChart'); 
  const [selectedCategory, setSelectedCategory] = useState('문제풀이'); 
  const { clearStorageData } = useQuestionStorage(user?.userId, 'testId'); // 추가: clearStorageData를 가져옴
  // **historyData 추가 정의**
  const historyData = [
    { year: '2024', date: '2024-11-14', examInfo: '2024년 수능' },
    { year: '2024', date: '2024-09-04', examInfo: '2024년 9월 모의고사' },
    { year: '2024', date: '2024-06-04', examInfo: '2024년 6월 모의고사' },
    { year: '2024', date: '2024-03-28', examInfo: '2024년 3월 모의고사' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 9월 시험' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];

  useEffect(() => {
    const loadRecentTests = async () => {
      try {
        if (!isAuthenticated || !user?.userId) return;

        setLoading(true);
        setIsModalOpen(!isAuthenticated);

        const tests = await fetchEightTests(user.userId);
        if (tests && tests.length > 0) {
          const sortedTests = tests.sort((a, b) => a.id - b.id);
          const chartData = sortedTests.map((test) => ({
            x: test.id,
            y: parseInt(test.score),
            label: test.yearAndMonth,
          }));
          setChartData(chartData);
        } else {
          setChartData([{ x: "No Data", y: 0 }]);
        }
      } catch (error) {
        console.error("Error fetching recent tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentTests();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const loadLastTest = async () => {
      try {
        if (!isAuthenticated || !user?.userId) return;

        const lastTest = await fetchLastTest(user.userId);
        if (lastTest) setLastTestData(lastTest);
      } catch (error) {
        console.error("Error fetching last test:", error);
      }
    };

    if (user && isAuthenticated) loadLastTest();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const loadCorrectQuestionCounts = async () => {
      try {
        if (!lastTestData?.id) return;

        const counts = await fetchCorrectQuestionCounts(lastTestData.id, lastTestData.userId, lastTestData.yearAndMonth);
        setCorrectQuestionCounts(counts);
      } catch (error) {
        console.error("Error fetching correct question counts:", error);
      }
    };

    if (lastTestData) loadCorrectQuestionCounts();
  }, [lastTestData]);

  const handleExamClick = (year, month) => {
    localStorage.setItem('lastSelectedYear', year.slice(2));
    localStorage.setItem('lastSelectedMonth', month);
    navigate(`/questions/${year.slice(2)}/${month}`);
  };

  const handleSolutionClick = (year, month) => {
    localStorage.setItem('lastSelectedYear', year.slice(2));
    localStorage.setItem('lastSelectedMonth', month);
    navigate(`/solutions/${year.slice(2)}/${month}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setActiveContent('YearSelectionTable');
  };

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
      setIsModalOpen(!isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleModalClose = () => setIsModalOpen(false);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="main-container">
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopNav isAuthenticated={isAuthenticated} user={user} />
        <MainBox>
          {isAuthenticated ? (
            <>
              <div className="content-area">
                <Box className="button-group-container" mb={2}>
                  <ButtonGroup>
                    <Button onClick={() => setActiveContent('LineChart')}>LineChart</Button>
                    <Button onClick={() => setActiveContent('QuestionTypeTable')}>QuestionTypeTable</Button>
                    <Button onClick={() => setActiveContent('YearSelectionTable')}>YearSelectionTable</Button>
                    <Button onClick={() => setActiveContent('Chatbot')}>Chatbot</Button>
                  </ButtonGroup>
                </Box>
                <MainBox className="content-box">
                  {activeContent === 'LineChart' && <LineChart data={[{ id: 'test', data: chartData }]} />}
                  {activeContent === 'QuestionTypeTable' && (
                    <QuestionTypeTable correctQuestionCounts={correctQuestionCounts} />
                  )}
                  {activeContent === 'YearSelectionTable' && (
                    <YearSelectionTable
                      years={years}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      filteredData={filteredData}
                      onExamClick={handleExamClick}
                      onSolutionClick={handleSolutionClick}
                      selectedCategory={selectedCategory}
                      handleCategoryChange={handleCategoryChange}
                      clearStorageData={clearStorageData}
                    />
                  )}
                  {activeContent === 'Chatbot' && <Chatbot />}
                </MainBox>
              </div>
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
            >
              <Typography variant="h3" gutterBottom>
                환영합니다!
              </Typography>
              <Typography variant="body1" style={{ marginTop: '16px' }}>
                Memo에 오신 것을 환영합니다. 로그인하거나 회원가입을 통해 더 많은 기능을 이용해보세요!
              </Typography>
            </Box>
          )}
        </MainBox>
        {isAuthenticated === false && <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />}
      </div>
    </div>
  );
}

export default MainPage;