import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography, Snackbar, Alert } from '@mui/material'; // Snackbar, Alert 추가
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import ProblemCard from '../components/Problem_Card';
import { AuthContext } from '../context/AuthContext';
import { updateUserAnswer, fetchIncorrectQuestions } from '../api/questionsApi';
import './SolutionsPage.css';

function MistakeSolutionsPage() {
  const { year, month } = useParams();
  const location = useLocation();
  const { score, testId: stateTestId } = location.state || {};
  const { user } = useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [incorrectDetails, setIncorrectDetails] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const userId = user?.userId;
  const testId = stateTestId;
  const yearAndMonth = `${year}-${month}`;

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchIncorrectQuestions(testId, userId, yearAndMonth);
      setIncorrectDetails(data);
      console.log('백엔드에서 최신 데이터를 가져왔습니다:', data);
    } catch (error) {
      console.error('오답 데이터를 가져오는 데 실패했습니다:', error);
    }
  }, [testId, userId, yearAndMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, incorrectDetails.length - 1));
  };

  const handleAnswerChange = (newAnswer) => {
    if (currentQuestion) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.number]: newAnswer,
      }));
    }
  };

  const handleComplete = async () => {
    const currentQuestion = incorrectDetails[currentQuestionIndex];
    if (currentQuestion && userId && testId) {
      const newAnswer = userAnswers[currentQuestion.number];

      if (String(newAnswer) === String(currentQuestion.rightAnswer)) { // 정답 확인
        setFeedbackMessage('정답입니다!');
        setShowSnackbar(true);

        try {
          const response = await updateUserAnswer(testId, userId, yearAndMonth, currentQuestion.number, newAnswer);
          console.log('백엔드 응답:', response);

          setIncorrectDetails((prev) => {
            const updatedDetails = prev.filter((question) => question.number !== currentQuestion.number);
            const newIndex = Math.min(currentQuestionIndex, updatedDetails.length - 1);
            setCurrentQuestionIndex(newIndex);
            return updatedDetails;
          });
        } catch (error) {
          console.error('백엔드 전송 실패:', error);
        }
      } else {
        setFeedbackMessage('오답입니다. 다시 시도해보세요.');
        setShowSnackbar(true);
      }
    } else {
      console.error('필수 데이터가 없습니다. userId 또는 testId를 확인하세요.');
    }
  };

  const currentQuestion = incorrectDetails[currentQuestionIndex];

  return (
    <div className="solutions-container">
      <Sidebar />
      <div className="content-wrapper">
        <TopNav />
        <div className="content-area">
          {currentQuestion ? (
            <>
              {/* <Box className="solution-card-container">
                <ProblemCard problemNumber={currentQuestion.number} />
              </Box> */}
              <Box className="solution-main-box">
                <QuestionInfoBox
                  year={year}
                  month={month}
                  currentQuestion={currentQuestion}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={incorrectDetails.length}
                  handlePreviousQuestion={handlePreviousQuestion}
                  handleNextQuestion={handleNextQuestion}
                  isSolutionPage={false}
                  hideMenuIcon
                  hideTime
                />
                <ProblemBox
                  alwaysShowCompleteButton
                  customClass="custom-solutions-style"
                  questionData={currentQuestion}
                  showAnswerField
                  showExplanation
                  onAnswerChange={handleAnswerChange}
                  initialAnswer={userAnswers[currentQuestion?.number] || ''}
                  isLastQuestion={currentQuestionIndex === incorrectDetails.length - 1}
                  onComplete={handleComplete}
                  withToggleExplanation = {true} // 해설 보기 버튼 활성화 여부
                  isQuestionPage = {true}
                />
              </Box>
            </>
          ) : (
            <Typography>모든 문제를 해결했습니다.</Typography>
          )}
        </div>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={feedbackMessage === '정답입니다!' ? 'success' : 'error'}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MistakeSolutionsPage;
