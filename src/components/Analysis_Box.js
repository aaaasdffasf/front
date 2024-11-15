import React from 'react';
import { Box, Typography } from '@mui/material';
import './CSS/Analysis_Box.css';

const Analysis_Box = ({ customClass }) => {
  return (
    <Box className={`analysisArea ${customClass}`}>
      {/* 첫 번째 박스 */}
      <Box className="recordBox">
        <Typography variant="body1" className="recordText">성적 변화 그래프</Typography>
      </Box>

      {/* 두 번째 박스 */}
      <Box className="analysisBox">
        <Typography variant="body1">분석 및 피드백</Typography>
      </Box>
    </Box>
  );
};

export default Analysis_Box;