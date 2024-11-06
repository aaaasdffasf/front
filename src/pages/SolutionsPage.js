// Solutions.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import SolutionCard from '../components/Problem_Card';
import ProblemBox from '../components/Problem_Box';
import { fetchQuestions } from '../api/questionsApi';
import './SolutionsPage.css';

function Solutions() {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = '24'; // 원하는 연도
  const month = '9'; // 원하는 월
  const questionNumber = '18'; // 가져오고 싶은 문제 번호

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);
        const singleQuestion = allQuestions.find((q) => q.number === questionNumber);

        if (singleQuestion) {
          setQuestionData(singleQuestion);
        } else {
          setError(`Question with number ${questionNumber} not found`);
        }
      } catch (error) {
        setError('Failed to load question data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [year, month, questionNumber]);

  return (
    <div className="solutions-container">
      <Sidebar />

      <div className="content-wrapper">
        <TopNav />

        <div className="content-area">
          <Box className="solution-card-container">
            {Array.from({ length: 5 }).map((_, index) => (
              <SolutionCard key={index} problemNumber={index + 18} />
            ))}
          </Box>

          <Box className="solution-main-box">
            <Box className="small-box">
              <Typography variant="h6" className="left-text">
                시험
              </Typography>
              <Typography variant="h6" className="center-text"></Typography>
              <Box className="button-box">
                <Button className="nav-button">
                  <ArrowBackIcon />
                </Button>
                <Button className="nav-button">
                  <ArrowForwardIcon />
                </Button>
              </Box>
            </Box>

            {/* ProblemBox에 불러온 문제 데이터 전달, showExplanation을 true로 설정 */}
            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <ProblemBox
                customClass="custom-solutions-style"
                questionData={questionData}
                showExplanation={true} // 해설 박스 표시
              />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
