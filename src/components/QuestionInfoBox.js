import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import ComparisonTable from './ComparisonTable';
import './QuestionInfoBox.css';

const QuestionInfoBox = ({
  year,
  month,
  currentQuestion,
  time, // 추가된 시간 관련 prop
  currentQuestionIndex,
  isLastQuestion,
  handlePreviousQuestion,
  handleNextQuestion,
  isSolutionPage = false,
  userId,
  yearAndMonth,
  questionData = [], // 기본값으로 빈 배열 설정
  incorrectQuestions = [], // 기본값으로 빈 배열 설정
  setCurrentQuestionIndex
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

      {!isSolutionPage && (
        <Typography variant="h6" className="center-text">
          학습 시간 : {`${Math.floor(time / 3600)}시간 ${Math.floor((time % 3600) / 60)}분 ${time % 60}초`}
        </Typography>
      )}

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
          <ComparisonTable
            questionData={questionData}
            incorrectQuestionNumbers={incorrectQuestions.map((q) => q.number)}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default QuestionInfoBox;
