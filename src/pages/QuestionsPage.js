import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import { fetchQuestions } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import './QuestionsPage.css';

function QuestionsPage() {
  const { user } = useContext(AuthContext);
  const [questionData, setQuestionData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const year = '24';
  const month = '9';
  const userId = user?.userId || ''; // 사용자의 ID를 AuthContext에서 가져옴

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);

        if (allQuestions && allQuestions.length > 0) {
          setQuestionData(allQuestions);
          setCurrentQuestionIndex(0);
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

  const handleAnswerChange = (newAnswer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: newAnswer,
    });
  };

  const handleComplete = () => {
    const answerArray = questionData.map((_, index) => answers[index] || '');
    localStorage.setItem('userAnswers', JSON.stringify(answerArray));

    // 로컬스토리지에 저장된 데이터 확인 및 콘솔 출력
    const savedAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    console.log('답안이 로컬스토리지에 저장되었습니다:', savedAnswers);

    sendAnswersToBackend(answerArray);
  };

  const sendAnswersToBackend = async (answerArray) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('토큰이 존재하지 않습니다. 로그인 상태를 확인하세요.');
        alert('로그인되지 않았습니다. 다시 로그인해주세요.');
        return;
      }

      console.log("Sending token:", token);
      console.log("Sending userId:", userId);

      const response = await fetch('http://localhost:8080/api/auth/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId, // 누락되지 않도록 확인
          year,
          month,
          userAnswers: answerArray,
          testTime: '30:00' // 예시 시간
        }),
      });

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
        if (response.status === 403) {
          console.error("접근 권한이 없습니다. 토큰을 확인하세요.");
        } else {
          console.error("서버와의 통신에 실패했습니다.");
        }
        throw new Error('답안 제출 실패');
      }

      console.log('답안이 성공적으로 제출되었습니다.');
      alert('답안이 성공적으로 제출되었습니다!');
    } catch (error) {
      console.error('답안 제출 오류:', error);
      alert(`답안 제출에 실패했습니다: ${error.message}`);
    }
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;

  return (
    <div className="problems-container">
      <Sidebar />

      <div className="content-wrapper">
        <TopNav />

        <div className="content-area">
          <Box className="problem-card-container">
            <ProblemCard problemNumber={currentQuestionIndex + 1} />
          </Box>

          <Box className="problem-main-box">
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

            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <ProblemBox
                customClass="custom-problem-style"
                questionData={currentQuestion}
                initialAnswer={currentAnswer}
                showExplanation={false}
                onAnswerChange={handleAnswerChange}
                isLastQuestion={isLastQuestion}
                onComplete={handleComplete}
              />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;
