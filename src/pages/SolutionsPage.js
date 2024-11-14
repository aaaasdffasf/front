import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import SolutionCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams } from 'react-router-dom';
import { fetchQuestions, fetchTestResult, fetchIncorrectQuestions } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import './SolutionsPage.css';

function SolutionsPage() {
  const { year, month } = useParams();
  const { user } = useContext(AuthContext);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  const userId = user?.userId;
  const yearAndMonth = `${year}-${month}`;
  const testId = 59;

  useEffect(() => {
    const loadQuestionsAndTestResult = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const allQuestions = await fetchQuestions(year, month);
        setQuestionData(allQuestions);
        console.log("Fetched questions:", allQuestions);

        const testResultData = await fetchTestResult(testId, userId, yearAndMonth);
        setTestResult(testResultData);
        console.log("Fetched test result:", testResultData);

        const incorrectData = await fetchIncorrectQuestions(testId, userId, yearAndMonth);
        setIncorrectQuestions(incorrectData);
        console.log("Fetched incorrect questions:", incorrectData);

      } catch (error) {
        setError('Failed to load data');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionsAndTestResult();
  }, [year, month, userId, yearAndMonth]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questionData.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;
  const currentAnswer = testResult?.userAnswer?.[currentQuestionIndex] || '';
  const totalScore = testResult?.score || 0; // 총점 설정

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
              time={0}
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              handlePreviousQuestion={handlePreviousQuestion}
              handleNextQuestion={handleNextQuestion}
              isSolutionPage={true}
              userId={userId}
              yearAndMonth={yearAndMonth}
              questionData={questionData}
              incorrectQuestions={incorrectQuestions}
              setCurrentQuestionIndex={setCurrentQuestionIndex} // 전달
            />

            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <ProblemBox
                  customClass="custom-solutions-style"
                  questionData={currentQuestion}
                  showExplanation={true}
                  userAnswer={currentAnswer} // 사용자 답안 전달
                  showUserAnswer={true} // 사용자 답안 표시 활성화
                />
                {/* 총점 표시 */}
                <Box mt={4} display="flex" justifyContent="center">
                  <Typography variant="h6">총점: {totalScore}점</Typography>
                </Box>
              </>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default SolutionsPage;
