import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import { fetchQuestions, submitAnswers } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import './QuestionsPage.css';

function QuestionsPage() {
  const { user } = useContext(AuthContext);
  const { year: paramYear, month: paramMonth } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(localStorage.getItem('lastQuestionIndex'), 10) || 0); // 저장된 인덱스 불러오기
  const [time, setTime] = useState(parseInt(localStorage.getItem('lastSelectedTime'), 10) || 0);
  const navigate = useNavigate();
  
  const userId = user?.userId || '';
  const year = paramYear || localStorage.getItem('lastSelectedYear');
  const month = paramMonth || localStorage.getItem('lastSelectedMonth');

  useEffect(() => {
    if (!year || !month) {
      console.error('No year or month found in URL or localStorage');
      return;
    }

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);

        if (allQuestions.length > 0) {
          setQuestionData(allQuestions);

          // 저장된 마지막 문제 인덱스를 로드
          const savedIndex = localStorage.getItem('lastQuestionIndex');
          setCurrentQuestionIndex(savedIndex ? parseInt(savedIndex, 10) : 0);
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

  // 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const updatedTime = prevTime + 1;
        localStorage.setItem('lastSelectedTime', updatedTime);
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // currentQuestionIndex가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

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

  const handleComplete = async () => {
    const answerArray = questionData.map((_, index) => answers[index] || '');
    localStorage.setItem('userAnswers', JSON.stringify(answerArray));

    try {
      const response = await submitAnswers(userId, year, month, answerArray, time);
      alert('답안이 성공적으로 제출되었습니다!');

      const { correctAnswers, incorrectAnswers, score } = response;
      const timeTaken = time;

      navigate('/score', {
        state: {
          userId,
          year,
          month,
          correctAnswers,
          incorrectAnswers,
          score,
          timeTaken,
        },
      });

      // 완료 후에는 저장된 진행 상태 초기화
      localStorage.removeItem('lastSelectedTime');
      localStorage.removeItem('lastQuestionIndex');
    } catch (error) {
      console.error('답안 제출 오류:', error);
      alert(`답안 제출에 실패했습니다: ${error.message}`);
    }
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;

  const handleTimeUpdate = (newTime) => {
    setTime(newTime);
  };

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
              <Typography variant="h6" className="left-text">
                {currentQuestion ? `${year}년 ${month}월 ${currentQuestion.number}번 문제` : '시험 정보를 불러오는 중...'}
              </Typography>
              <Typography variant="h6" className="center-text">
                학습 시간 : {`${Math.floor(time / 3600)}시간 ${Math.floor((time % 3600) / 60)}분 ${time % 60}초`}
              </Typography>
              <Box className="button-box">
                <Button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
                  <ArrowBackIcon />
                </Button>
                <Button onClick={handleNextQuestion} className="nav-button" disabled={isLastQuestion}>
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
                onTimeUpdate={handleTimeUpdate}
              />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;
