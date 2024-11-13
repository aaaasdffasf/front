import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import ComparisonTable from './ComparisonTable'; // ComparisonTable 추가
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
  userId,
  yearAndMonth,
  questionData,
  incorrectQuestions, // 전체 문제와 틀린 문제 데이터 받기
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <Box className="question-info-box">
      <Typography variant="h6" className="left-text">
        {currentQuestion ? `${year}년 ${month}월 ${currentQuestion.number}번 문제` : '시험 정보를 불러오는 중...'}
      </Typography>

      <Box className="button-box">
        <IconButton onClick={toggleModal} className="nav-button">
          <MenuIcon />
        </IconButton>
        <Button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
          <ArrowBackIcon />
        </Button>
        <Button onClick={handleNextQuestion} className="nav-button" disabled={isLastQuestion}>
          <ArrowForwardIcon />
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={toggleModal}>
        <Box style={{ padding: 20, backgroundColor: 'white', margin: '50px auto', maxWidth: '600px' }}>
          <ComparisonTable questionData={questionData} incorrectQuestionNumbers={incorrectQuestions.map((q) => q.number)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default QuestionInfoBox;
