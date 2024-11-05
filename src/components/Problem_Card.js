// Problem_Card.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function ProblemCard({ problemNumber }) {
  return (
    <Box
      sx={{
        height: '80px',
        width: '231px', // 고정된 너비 설정
        backgroundColor: 'white',
        borderRadius: 3,
        textAlign: 'center',
        mx: 1, // 각 박스 사이 간격
        display: 'inline-flex', // inline-flex로 설정하여 가로 스크롤에 맞게 배치
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6">문제 {problemNumber}</Typography>
    </Box>

    
  );
}

ProblemCard.propTypes = {
  problemNumber: PropTypes.number.isRequired,
};



export default ProblemCard;
