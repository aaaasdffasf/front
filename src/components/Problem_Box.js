import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const ProblemBox = ({
  customClass,
  questionData,
  showExplanation = false,
  onAnswerChange,
  initialAnswer = '',
  isLastQuestion,
  onComplete,
  userAnswer,
  showUserAnswer = false
}) => {
  const [answer, setAnswer] = useState(initialAnswer);

  // 문제 변경 시 초기 답안 세팅
  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer]);

  // 답안 입력 처리 함수
  const handleInputChange = (event) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    if (onAnswerChange) onAnswerChange(newAnswer); // 상위 컴포넌트로 답안 전달
  };

  return (
    <Box className={`problemArea ${customClass}`}>
      <Box className="problemBox">
        {/* 이미지 중앙 정렬 */}
        <Box className="imageContainer">
          <img src={questionData.text} alt="문제 이미지" className="questionImage" />
        </Box>

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
                onClick={onComplete}
                size="small"
              >
                완료
              </Button>
            )}
          </Box>
        )}
        
        {/* 사용자 답안 표시 (검은색으로 설정) */}
        {showUserAnswer && userAnswer && (
          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="body1" style={{ color: 'black' }}>
              사용자 답안: {userAnswer}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 설명(해설) 박스 추가 */}
      {showExplanation && questionData.description && (
        <Box className="explanationBox">
          <Typography variant="body2">설명: {questionData.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProblemBox;
