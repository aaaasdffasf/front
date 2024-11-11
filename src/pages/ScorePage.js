// ScorePage.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ScorePage = () => {
  const location = useLocation();
  const {
    userId,
    year,
    month,
    correctAnswers = 0,
    incorrectAnswers = 0,
    score = 0,
    timeTaken = 0,
  } = location.state || {};

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>성적 결과</Typography>
      <Typography variant="h6">사용자 ID: {userId}</Typography>
      <Typography variant="h6">연도 및 월: 20{year}년 / {month}월</Typography>
      <Typography variant="h6">정답 개수: {correctAnswers}</Typography>
      <Typography variant="h6">오답 개수: {incorrectAnswers}</Typography>
      <Typography variant="h6">총 점수: {score}점</Typography>
      <Typography variant="h6">풀이 시간: {Math.floor(timeTaken / 60)}분 {timeTaken % 60}초</Typography>
    </Box>
  );
};

export default ScorePage;
