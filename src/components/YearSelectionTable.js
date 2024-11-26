import React from 'react';
import { Box, Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({
  years,
  selectedYear,
  setSelectedYear,
  filteredData,
  onExamClick,
  onSolutionClick,
  selectedCategory,
  handleCategoryChange,
  clearStorageData, // 추가: 로컬 스토리지 초기화 함수
}) {
  const handleExamStart = (year, month, testId) => {
    // 진행 상태와 시간 초기화
    clearStorageData(); // 저장된 모든 데이터를 초기화
    localStorage.setItem(`${testId}_elapsedTime`, '0'); // 초기 시간 설정
    localStorage.setItem(`${testId}_currentQuestionIndex`, '0'); // 초기 문제 인덱스 설정

    // 문제풀이 혹은 문제해설에 따라 이동
    if (selectedCategory === '문제풀이') {
      onExamClick(year, month);
    } else {
      onSolutionClick(year, month);
    }
  };

  return (
    <>
      <Box className="yearCategories" mt={0}>
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => setSelectedYear(year)}
            variant={selectedYear === year ? 'contained' : 'outlined'}
            style={{ marginRight: 8 }}
          >
            {year}년
          </Button>
        ))}
      </Box>
      <Box className="button-group-container" mt={2}>
        <ButtonGroup>
          <Button
            variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
            onClick={() => handleCategoryChange('문제풀이')}
          >
            문제풀이
          </Button>
          <Button
            variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
            onClick={() => handleCategoryChange('문제해설')}
          >
            문제해설
          </Button>
        </ButtonGroup>
      </Box>
      <TableContainer component={Paper} className="examTable" sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>시험 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((record, index) => {
              const year = record.year;
              const month = record.examInfo.split(' ')[1].replace('월', '');
              const testId = `${year.slice(2)}_${month}`; // testId 생성

              return (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => handleExamStart(year, month, testId)} // 클릭 시 초기화 후 이동
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {record.examInfo}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default YearSelectionTable;
