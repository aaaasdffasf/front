// YearSelectionTable.js
import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({ years, selectedYear, setSelectedYear, filteredData, onExamClick }) {
  return (
    <>
      {/* 연도 선택 버튼 */}
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

      {/* 시험 기록 테이블 */}
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
                      onClick={() => onExamClick(year, month)} // 클릭 시 onExamClick 호출
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
