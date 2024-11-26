import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import ScoreModal from '../components/ScoreModal';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams } from 'react-router-dom';
import { fetchQuestions, submitAnswers } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import useQuestionStorage from '../hooks/useQuestionStorage';
import './QuestionsPage.css';

function QuestionsPage() {
  const { user } = useContext(AuthContext);
  const { year, month } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const userId = user?.userId || 'guest'; // 사용자 ID를 가져옵니다. 없으면 'guest'로 처리
  

  // 사용자 ID와 시험 정보를 포함한 키로 로컬 스토리지 상태 관리
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    elapsedTime, 
    setElapsedTime, 
    answers, 
    setAnswers, 
    clearStorageData 
  } = useQuestionStorage(user?.userId, `${year}-${month}`);
  
  
  

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);

        if (allQuestions.length > 0) {
          setQuestionData(allQuestions);
        } else {
          setError('No questions found for the selected year and month.');
        }
      } catch (error) {
        setError('Failed to load question data.');
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

  const handleComplete = async () => {
    const answerArray = questionData.map((_, index) => answers[index] || 'X');

    try {
      const response = await submitAnswers(userId, year, month, answerArray, elapsedTime);

      setScoreData({
        userId,
        year,
        month,
        correctAnswers: response.correctCount,
        incorrectAnswers: response.wrongCount,
        totalScore: response.totalScore,
        timeTaken: elapsedTime,
      });
      setIsScoreModalOpen(true);

      clearStorageData(); // 저장 데이터 초기화
    } catch (error) {
      console.error('답안 제출 오류:', error);
      alert(`답안 제출에 실패했습니다: ${error.message}`);
    }
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;

  if (!loading && (!questionData || questionData.length === 0)) {
    return (
      <div className="problems-container">
        <Sidebar />
        <div className="content-wrapper">
          <TopNav />
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h4" color="error">
              시험을 풀고 오세요.
            </Typography>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-container">
      <Sidebar />
      <div className="content-wrapper">
        <TopNav />
        <div className="content-area">
          {/* <Box className="problem-card-container">
            <ProblemCard problemNumber={currentQuestionIndex + 1} />
          </Box> */}
          <Box className="problem-main-box">
            <QuestionInfoBox
              year={year}
              month={month}
              currentQuestion={currentQuestion}
              time={elapsedTime}
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              handlePreviousQuestion={handlePreviousQuestion}
              handleNextQuestion={handleNextQuestion}
              isSolutionPage={false}
              hideMenuIcon={true}
              isQuestionPage = {true}
            />

            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <ProblemBox
                customClass="custom-problem-style"
                isQuestionPage={true}
                questionData={currentQuestion}
                initialAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                isLastQuestion={isLastQuestion}
                onComplete={handleComplete}
                onTimeUpdate={setElapsedTime}
                showAnswerField={true} // 답 입력 필드 표시
                showExplanation={false} // 해설 표시
              />
            )}
          </Box>
        </div>
      </div>

      {scoreData && (
        <ScoreModal open={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} scoreData={scoreData} />
      )}
    </div>
  );
}

export default QuestionsPage;
