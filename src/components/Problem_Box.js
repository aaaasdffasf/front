import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const Problem_Box = ({ customClass, questionData, showExplanation = false, onAnswerChange, initialAnswer = '', isLastQuestion, onComplete }) => {
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    setAnswer(initialAnswer); // 문제 변경 시 답 초기화
  }, [initialAnswer]);

  const handleInputChange = (event) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

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
        
        {!showExplanation && (
          <Box mt={2} display="flex" alignItems="center" justifyContent="center">
            <TextField
              variant="outlined"
              placeholder="답을 입력하세요"
              size="small"
              className="answer-input"
              value={answer}
              onChange={handleInputChange}
            />
            {/* 입력 필드 옆에 완료 버튼을 추가 */}
            {isLastQuestion && (
              <Button 
                variant="contained" 
                className="complete-button" 
                onClick={onComplete} 
                size="small" 
              >
                완료
              </Button>
            )}
          </Box>
        )}
      </Box>

      {showExplanation && (
        <Box className="explanationBox">
          <Typography variant="body1">{questionData.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Problem_Box;
