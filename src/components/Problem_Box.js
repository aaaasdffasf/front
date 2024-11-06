// Problem_Box.js
import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const Problem_Box = ({ customClass, questionData, showExplanation = false }) => {
  if (!questionData) {
    return <Typography>No question data available</Typography>;
  }

  return (
    <Box className={`problemArea ${customClass}`}>
      <Box className="problemBox">
        <img
          src={questionData.text}
          alt="문제 이미지"
          className="questionImage"
        />
        
        {/* showExplanation이 false일 때만 입력 필드와 버튼을 보여줍니다 */}
        {!showExplanation && (
          <Box mt={2} display="flex" alignItems="center" justifyContent="center">
            <TextField
              variant="outlined"
              placeholder="답을 입력하세요"
              size="small"
              className="answer-input"
            />
            <Button variant="contained" color="primary" style={{ marginLeft: '8px' }}>
              입력
            </Button>
          </Box>
        )}
      </Box>

      {/* 해설 박스는 showExplanation이 true일 때만 렌더링 */}
      {showExplanation && (
        <Box className="explanationBox">
          <Typography variant="body1">{questionData.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Problem_Box;
