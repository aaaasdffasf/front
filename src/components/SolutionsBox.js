// ProblemBox.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const ProblemBox = ({ customClass, questionData, showExplanation = true, onAnswerChange, initialAnswer = '', isLastQuestion }) => {
  const [answer, setAnswer] = useState(initialAnswer);

  // 문제 변경 시 초기 답안 세팅
  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer]);

  // 답안 입력 처리 함수
  const handleInputChange = (event) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

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
            {isLastQuestion && (
              <Button
                variant="contained"
                className="complete-button"
                onClick={() => {
                  onComplete();
                  handleStop(); // 완료 시 타이머 정지
                }}
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
          <Typography variant="body2">설명: {questionData.explanation}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProblemBox;
