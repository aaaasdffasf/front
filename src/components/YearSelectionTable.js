// YearSelectionTable.js
import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({ years, selectedYear, setSelectedYear, filteredData }) {
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
            {filteredData.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.examInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default YearSelectionTable;
