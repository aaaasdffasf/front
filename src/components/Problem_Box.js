// Problem_Box.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { fetchQuestions } from '../api/questionsApi'; // 기존 함수 임포트
import './Problem_Box.css';

const Problem_Box = ({
  customClass,
  year = '24',
  month = '9',
  number = 18,
}) => {
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        // 해당 월의 모든 문제를 가져옴
        const allQuestions = await fetchQuestions(year, month);

        // 문제 번호로 필터링하여 필요한 문제만 가져옴
        const singleQuestion = allQuestions.find((q) => q.number === number);

        if (singleQuestion) {
          setQuestionData(singleQuestion);
        } else {
          console.error(`Question with number ${number} not found`);
        }
      } catch (error) {
        console.error('Failed to load question data:', error);
      }
    };

    loadQuestion();
  }, [year, month, number]);

  if (!questionData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className={`problemArea ${customClass}`}>
      {/* 첫 번째 박스 */}
      <Box className="problemBox">
        {/* 이미지로 문제 표시 */}
        <img
          src={questionData.text}
          alt="문제 이미지"
          className="problemImage"
        />
        <Box className="answer-box">
          <TextField
            variant="outlined"
            placeholder="답을 입력하세요"
            size="small"
            className="answer-input"
          />
        </Box>
      </Box>
      {/* 두 번째 박스 */}
      <Box className="explanationBox">
        <Typography variant="body1">{questionData.description}</Typography>
      </Box>
    </Box>
  );
};

export default Problem_Box;
