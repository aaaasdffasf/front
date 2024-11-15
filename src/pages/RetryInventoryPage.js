//분석 or 피드백 화면

import { Box, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import YearSelectionTable from '../components/YearSelectionTable';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 임포트
import TopNav from '../components/TopNav';

function Analysis() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleExamClick = (year, month) => {
    const shortYear = year.slice(2); // "2024" -> "24"
    navigate(`/retry/${shortYear}/${month}`); // 경로 파라미터 형식으로 shortYear와 month 전달
  };

  const historyData = [
    { year: '2024', date: '2024-10-15', examInfo: '2024년 9월 시험' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 8월 시험' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);

  return (
    <div style={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar />

      <div style={{ flex: 1 }}>
        {/* 상단 네비게이션 바 */}
        <TopNav />

        <div style={{ backgroundColor: '#F3F6FE', minHeight: '91vh', paddingTop: '2px', display: 'flex', flexDirection: 'column' }}>
          {/* 컨텐츠 영역 */}
          <Box>
          {isAuthenticated && (
            <YearSelectionTable
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              filteredData={filteredData}
              onExamClick={handleExamClick} // handleExamClick 함수 전달
            />
          )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
