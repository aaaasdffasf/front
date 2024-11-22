import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import ProblemCard from '../components/Problem_Card';
import { AuthContext } from '../context/AuthContext';
import { updateUserAnswer } from '../api/questionsApi'; // updateUserAnswer 함수 임포트
import './SolutionsPage.css';

function MistakeSolutionsPage() {
  const { year, month } = useParams();
  const location = useLocation();
  const { incorrectDetails, score, testId: stateTestId } = location.state || {};
  const { user } = useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const userId = user?.userId;
  const testId = stateTestId;
  const currentQuestion = incorrectDetails?.[currentQuestionIndex];
  const yearAndMonth = `${year}-${month}`;

  useEffect(() => {
    console.log('데이터 확인:');
    console.log('incorrectDetails:', incorrectDetails);
    console.log('score:', score);
    console.log('testId:', testId);
    console.log('userId:', userId);
    console.log('yearAndMonth:', yearAndMonth);
  }, [incorrectDetails, score, testId, userId, yearAndMonth]);

  useEffect(() => {
    if (currentQuestion) {
      console.log('현재 질문 데이터:', currentQuestion);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!userId) {
      console.error('사용자 ID가 없습니다. 로그인 상태를 확인해주세요.');
    }

    if (!testId) {
      console.error('시험 ID가 전달되지 않았습니다. 데이터를 확인해주세요.');
    }
  }, [userId, testId]);

  useEffect(() => {
    if (currentQuestion) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.number]: currentQuestion.userAnswer || '',
      }));
    }
  }, [currentQuestion]);

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, incorrectDetails.length - 1)
    );
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
    if (currentQuestion && userId && testId) {
      const newSubmission = {
        id: testId,
        userId: userId,
        yearAndMonth: yearAndMonth,
        questionNumber: currentQuestion.number,
        newAnswer: userAnswers[currentQuestion.number],
      };

      // 제출된 답안을 배열에 추가
      setSubmittedAnswers((prev) => [...prev, newSubmission]);

      // 데이터 생성 후 콘솔 출력
      console.log('저장된 답안:', [...submittedAnswers, newSubmission]);

      try {
        // updateUserAnswer 함수 호출하여 백엔드로 전송
        const response = await updateUserAnswer(
          testId,
          userId,
          yearAndMonth,
          currentQuestion.number,
          userAnswers[currentQuestion.number]
        );
        console.log('백엔드 응답:', response);
      } catch (error) {
        console.error('백엔드 전송 실패:', error);
      }
    } else {
      console.error('필수 데이터가 없습니다. userId 또는 testId를 확인하세요.');
    }
  };

  return (
    <div className="solutions-container">
      <Sidebar />
      <div className="content-wrapper">
        <TopNav />
        <div className="content-area">
          {currentQuestion && (
            <Box className="solution-card-container">
              <ProblemCard problemNumber={currentQuestion.number} />
            </Box>
          )}

          <Box className="solution-main-box">
            {currentQuestion ? (
              <>
                <QuestionInfoBox
                  year={year}
                  month={month}
                  currentQuestion={currentQuestion}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={incorrectDetails.length}
                  handlePreviousQuestion={handlePreviousQuestion}
                  handleNextQuestion={handleNextQuestion}
                  isSolutionPage={false}
                  hideMenuIcon={true}
                  hideTime={true}
                />

                <ProblemBox
                  alwaysShowCompleteButton={true}
                  customClass="custom-solutions-style"
                  questionData={currentQuestion}
                  showAnswerField={true}
                  showExplanation={true}
                  onAnswerChange={handleAnswerChange}
                  initialAnswer={userAnswers[currentQuestion?.number] || ''}
                  isLastQuestion={currentQuestionIndex === incorrectDetails.length - 1}
                  onComplete={handleComplete}
                />

                <Box mt={4} display="flex" justifyContent="center">
                  <Typography variant="h6">총점: {score}점</Typography>
                </Box>
              </>
            ) : (
              <Typography>오답 데이터가 없습니다.</Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default MistakeSolutionsPage;
