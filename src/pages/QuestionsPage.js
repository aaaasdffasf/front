//Questions.js

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemCard from '../components/Problem_Card'; // ProblemCard 컴포넌트 임포트
import ProblemBox from '../components/Problem_Box'; // ProblemBox 컴포넌트 임포트 (수정됨)
import './QuestionsPage.css';

function questionsPage() {
  return (
    <div className="problems-container">
      {/* 사이드바 */}
      <Sidebar />

      <div className="content-wrapper">
        {/* 상단 네비게이션 바 */}
        <TopNav />

        <div className="content-area">
          {/* 큰 박스 안에 작은 박스 5개를 가로 스크롤로 배치 */}
          <Box className="problem-card-container">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProblemCard key={index} problemNumber={index + 18} />
            ))}
          </Box>

          {/* 컨텐츠 영역 */}
          <Box className="problem-main-box">
            {/* 작은 박스 추가 */}
            <Box className="small-box">
              {/* 왼쪽: 시험 문구 */}
              <Typography variant="h6" className="left-text">시험</Typography>

              {/* 중앙: 학습 시간 문구 */}
              <Typography variant="h6" className="center-text">학습 시간:</Typography>

              {/* 오른쪽: 버튼 2개 */}
              <Box className="button-box">
                <Button className="nav-button">
                  <ArrowBackIcon />
                </Button>
                <Button className="nav-button">
                  <ArrowForwardIcon />
                </Button>
              </Box>
            </Box>

            {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
            <ProblemBox customClass="custom-problem-style" />
          </Box>
        </div>
      </div>
    </div>
  );
}

export default questionsPage;