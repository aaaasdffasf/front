// SolutionsPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import SolutionCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams } from 'react-router-dom';
import { fetchQuestions } from '../api/questionsApi';
import './SolutionsPage.css';

function SolutionsPage() {
  const { year, month } = useParams(); // URL에서 year와 month 파라미터 가져오기
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;

  return (
    <div className="solutions-container">
      <Sidebar />

      <div className="content-wrapper">
        <TopNav />

        <div className="content-area">
          <Box className="solution-card-container">
            <SolutionCard problemNumber={currentQuestionIndex + 1} />
          </Box>

          <Box className="solution-main-box">
            <QuestionInfoBox
              year={year}
              month={month}
              currentQuestion={currentQuestion}
              time={0} // 학습 시간 필요 시 별도 처리
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              handlePreviousQuestion={handlePreviousQuestion}
              handleNextQuestion={handleNextQuestion}
              isSolutionPage={true} // SolutionPage임을 나타내기 위해 true로 설정
              handleMenuClick={() => console.log("메뉴 버튼 클릭됨")} // 메뉴 클릭 핸들러
            />

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

export default SolutionsPage;
