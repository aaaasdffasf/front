// YearSelectionTable.js
import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({ years, selectedYear, setSelectedYear, filteredData, onExamClick }) {
  const handleExamClick = (year, month) => {
    // 진행 상태 초기화
    localStorage.removeItem('lastQuestionIndex');
    localStorage.removeItem('lastSelectedTime');

    // 해당 시험 페이지로 이동
    onExamClick(year, month);
  };

  return (
    <>
      <Box className="yearCategories" mt={3}>
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

              return (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => handleExamClick(year, month)} // 클릭 시 진행 상태 초기화 및 onExamClick 호출
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
