// Solutions.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import SolutionCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import { fetchQuestions } from '../api/questionsApi';
import './SolutionsPage.css';

function Solutions() {
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // 원하는 연도와 월 설정 (하드코딩 예시, 필요한 경우 변경 가능)
  const year = '24';
  const month = '9';

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);

        if (allQuestions && allQuestions.length > 0) {
          setQuestionData(allQuestions);
          setCurrentQuestionIndex(0); // 첫 번째 문제로 시작
        } else {
          setError('No questions found for the selected year and month.');
        }
      } catch (error) {
        setError('Failed to load question data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [year, month]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questionData.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const currentQuestion = questionData[currentQuestionIndex];

  return (
    <div className="solutions-container">
      <Sidebar />

      <div className="content-wrapper">
        <TopNav />

        <div className="content-area">
          <Box className="solution-card-container">
            <SolutionCard />
          </Box>

          <Box className="solution-main-box">
            <Box className="small-box">
              <Typography variant="h6" className="left-text">시험</Typography>
              <Typography variant="h6" className="center-text">학습 시간:</Typography>
              <Box className="button-box">
                <Button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
                  <ArrowBackIcon />
                </Button>
                <Button onClick={handleNextQuestion} className="nav-button" disabled={currentQuestionIndex === questionData.length - 1}>
                  <ArrowForwardIcon />
                </Button>
              </Box>
            </Box>

            {/* ProblemBox에 불러온 문제 데이터 전달, showExplanation을 true로 설정 */}
            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <ProblemBox
                customClass="custom-solutions-style"
                questionData={currentQuestion}
                showExplanation={true} // 해설 박스 표시
              />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
