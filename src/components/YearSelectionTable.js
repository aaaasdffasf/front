import React from 'react';
import { Box, Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({
  years,
  selectedYear,
  setSelectedYear,
  filteredData,
  onExamClick,
  selectedCategory,
  handleCategoryChange,
  handleFileChange,
  fileInputRef,
}) {
  const handleExamClick = (year, month) => {
    localStorage.removeItem('lastQuestionIndex');
    localStorage.removeItem('lastSelectedTime');
    onExamClick(year, month);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 2,
      }}
    >
      {/* 파일 불러오기 버튼 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          fontSize: '12px',
          padding: '4px 8px',
        }}
        onClick={() => fileInputRef.current.click()}
      >
        파일 불러오기
      </Button>

      {/* 카테고리 버튼 그룹 */}
      <Box textAlign="center" mb={2}>
        <ButtonGroup>
          <Button
            variant={selectedCategory === '문제풀이' ? 'contained' : 'outlined'}
            sx={{ padding: '8px 16px', fontSize: '14px', minWidth: '80px' }}
            onClick={() => handleCategoryChange('문제풀이')}
          >
            문제풀이
          </Button>
          <Button
            variant={selectedCategory === '문제해설' ? 'contained' : 'outlined'}
            sx={{ padding: '8px 16px', fontSize: '14px', minWidth: '80px' }}
            onClick={() => handleCategoryChange('문제해설')}
          >
            문제해설
          </Button>
        </ButtonGroup>
      </Box>

      {/* 연도 선택 버튼 */}
      <Box className="yearCategories" mt={1} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => setSelectedYear(year)}
            variant={selectedYear === year ? 'contained' : 'outlined'}
            sx={{
              margin: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              minWidth: '80px',
            }}
          >
            {year}년
          </Button>
        ))}
      </Box>

      {/* 시험 정보 테이블 */}
      <TableContainer
        component={Paper}
        className="examTable"
        sx={{
          marginTop: 2,
          width: '100%',
          maxWidth: '800px',
          height: '100%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}>날짜</TableCell>
              <TableCell sx={{ padding: '12px', fontSize: '16px', fontWeight: 'bold' }}>시험 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((record, index) => {
              const year = record.year;
              const month = record.examInfo.split(' ')[1].replace('월', '');

              return (
                <TableRow key={index} sx={{ height: '50px' }}>
                  <TableCell sx={{ padding: '12px', fontSize: '14px' }}>{record.date}</TableCell>
                  <TableCell sx={{ padding: '12px', fontSize: '14px' }}>
                    <span
                      onClick={() => handleExamClick(year, month)}
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
    </Box>
  );
}

export default YearSelectionTable;
