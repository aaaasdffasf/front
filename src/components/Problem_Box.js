import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const ProblemBox = ({
  customClass,
  questionData,
  showAnswerField = true, // 답 입력 필드 표시 여부
  showExplanation = false, // 해설 표시 여부
  onAnswerChange,
  initialAnswer = '',
  isLastQuestion,
  onComplete,
  userAnswer,
  showUserAnswer = false,
  alwaysShowCompleteButton = false, // 항상 완료 버튼 표시 여부
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
        {/* 문제 이미지 */}
        <Box className="imageContainer">
          <img src={questionData.text} alt="문제 이미지" className="questionImage" />
        </Box>

        {/* 답 입력 필드 */}
        {showAnswerField && (
          <Box mt={2} display="flex" alignItems="center" justifyContent="center">
            <TextField
              variant="outlined"
              placeholder="답을 입력하세요"
              size="small"
              className="answer-input"
              value={answer}
              onChange={handleInputChange}
            />
            {(isLastQuestion || alwaysShowCompleteButton) && (
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

        {/* 사용자 답안 표시 */}
        {showUserAnswer && userAnswer && (
          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="body1" style={{ color: 'black' }}>
              사용자 답안: {userAnswer}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 해설(설명) 박스 */}
      {showExplanation && questionData.description && (
        <Box mt={2} className="explanationBox">
          <Typography variant="body2">설명: {questionData.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProblemBox;
