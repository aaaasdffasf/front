import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import ProblemCard from '../components/Problem_Card';
import './SolutionsPage.css';

function MistakeSolutionsPage() {
  const { year, month } = useParams();
  const location = useLocation();
  const { incorrectDetails, score } = location.state || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = incorrectDetails?.[currentQuestionIndex];

  useEffect(() => {
    console.log('Filtered Incorrect Details:', incorrectDetails);
    console.log('Score:', score);
    console.log('Current Question:', currentQuestion);
  }, [incorrectDetails, score, currentQuestion]);

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, incorrectDetails.length - 1)
    );
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
                  customClass="custom-problem-style"
                  questionData={currentQuestion}
                  showExplanation={true}
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
