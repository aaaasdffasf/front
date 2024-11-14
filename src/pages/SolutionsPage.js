import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import SolutionCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions, fetchTestResult, fetchIncorrectQuestions } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import './SolutionsPage.css';

function SolutionsPage() {
  const { year, month, number } = useParams(); // number를 URL 파라미터로 받음
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  // questionData가 로드된 이후에 number에 해당하는 인덱스 설정
  useEffect(() => {
    if (questionData.length > 0 && number) {
      const index = questionData.findIndex((q) => q.number === number);
      if (index !== -1) {
        setCurrentQuestionIndex(index);
      } else {
        console.warn(`Question with number ${number} not found`);
      }
    }
  }, [questionData, number]);

  const handleNextQuestion = () => {
    const nextIndex = Math.min(currentQuestionIndex + 1, questionData.length - 1);
    setCurrentQuestionIndex(nextIndex);
    const nextQuestionNumber = questionData[nextIndex].number;
    navigate(`/solutions/${year}/${month}/${nextQuestionNumber}`);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = Math.max(currentQuestionIndex - 1, 0);
    setCurrentQuestionIndex(prevIndex);
    const prevQuestionNumber = questionData[prevIndex].number;
    navigate(`/solutions/${year}/${month}/${prevQuestionNumber}`);
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;
  const currentAnswer = testResult?.userAnswer?.[currentQuestionIndex] || '';
  const totalScore = testResult?.score || 0;

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
              setCurrentQuestionIndex={setCurrentQuestionIndex}
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
                  userAnswer={currentAnswer}
                  showUserAnswer={true}
                />
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
