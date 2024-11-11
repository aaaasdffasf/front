// src/components/QuestionInfoBox.js
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import ComparisonTable from './ComparisonTable'; // 정답 비교 표 컴포넌트 import
import './QuestionInfoBox.css';

const QuestionInfoBox = ({
  year,
  month,
  currentQuestion,
  time,
  currentQuestionIndex,
  isLastQuestion,
  handlePreviousQuestion,
  handleNextQuestion,
  isSolutionPage = false,
  handleMenuClick,
  id, // testId 추가
}) => {
  const [showComparison, setShowComparison] = useState(false);

  const toggleComparison = () => {
    setShowComparison((prev) => !prev);
  };

  return (
    <Box className="question-info-box">
      <Typography variant="h6" className="left-text">
        {currentQuestion ? `${year}년 ${month}월 ${currentQuestion.number}번 문제` : '시험 정보를 불러오는 중...'}
      </Typography>

      {!isSolutionPage && (
        <Typography variant="h6" className="center-text">
          학습 시간 : {`${Math.floor(time / 3600)}시간 ${Math.floor((time % 3600) / 60)}분 ${time % 60}초`}
        </Typography>
      )}

      <Box className="button-box">
        <IconButton onClick={toggleComparison} className="nav-button">
          <MenuIcon />
        </IconButton>
        <Button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
          <ArrowBackIcon />
        </Button>
        <Button onClick={handleNextQuestion} className="nav-button" disabled={isLastQuestion}>
          <ArrowForwardIcon />
        </Button>
      </Box>

      {/* ComparisonTable 팝업 */}
      {showComparison && (
        <Box className="comparison-popup">
          <ComparisonTable id={id} yearAndMonth={`${year}${month}`} />
        </Box>
      )}
    </Box>
  );
};

export default QuestionInfoBox;
