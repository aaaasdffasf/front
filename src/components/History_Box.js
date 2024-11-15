import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './CSS/History_Box.css';

const History_Box = ({ customClass }) => {

  const historyData = [
    { date: '2024-11-01', examInfo: '2024년 9월 모의고사' },
    { date: '2024-10-15', examInfo: '2024년 6월 모의고사' },
    { date: '2024-09-25', examInfo: '2024년 3월 모의고사' },
  ];

  return (
    <Box className={`historyArea ${customClass}`}>
      {/* 첫 번째 박스 */}
      <Box className="historyBox">
        <Typography variant="body1" className="historyText">학습 기록</Typography>
        {/* 학습 기록 표 */}
        <TableContainer component={Paper} className="historyTable">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>시험 정보</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.examInfo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 두 번째 박스 */}
      <Box className="recentlyProblemBox">
        {/* 버튼 영역 */}
        <Box className="button-box">
          <Button className="back-button">
            <ArrowBackIcon />
          </Button>
          <Button className="forward-button">
            <ArrowForwardIcon />
          </Button>
        </Box>
        <Typography variant="body1">최근 푼 문제</Typography>
      </Box>
    </Box>
    
  );
};

export default History_Box;