// ScoreModal.js
import React from 'react';
import { Box, Typography, Button, Modal, Backdrop, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ScoreModal.css'; // CSS 파일을 import

const ScoreModal = ({ open, onClose, scoreData }) => {
  const { userId, year, month, correctAnswers = 0, incorrectAnswers = 0, totalScore = 0, timeTaken = 0 } = scoreData;
  const navigate = useNavigate();

  // 대시보드로 이동하는 함수
  const handleGoToDashboard = () => {
    onClose();
    navigate('/'); // 필요한 경로로 수정
  };

  // 문제 해설 화면으로 이동하는 함수
  const handleGoToSolutionScreen = () => {
    onClose();
    navigate(`/solutions/${year}/${month}`); // 필요한 경로로 수정
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className="score-modal-box">
          <Typography variant="h4" gutterBottom>성적 결과</Typography>
          <Typography variant="h6">사용자 ID: {userId}</Typography>
          <Typography variant="h6">연도 및 월: 20{year}년 / {month}월</Typography>
          <Typography variant="h6">정답 개수: {correctAnswers}</Typography>
          <Typography variant="h6">오답 개수: {incorrectAnswers}</Typography>
          <Typography variant="h6">총 점수: {totalScore}점</Typography>
          <Typography variant="h6">풀이 시간: {Math.floor(timeTaken / 60)}분 {timeTaken % 60}초</Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="secondary" onClick={handleGoToDashboard}>대시보드로 이동</Button>
            <Button variant="contained" color="primary" onClick={handleGoToSolutionScreen}>문제 해설 화면</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ScoreModal;
