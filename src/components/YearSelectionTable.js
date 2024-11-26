import React from 'react';
import { Box, Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function YearSelectionTable({
  years,
  selectedYear,
  setSelectedYear,
  filteredData,
  onExamClick,
  handleFileChange,
  fileInputRef,
  selectedCategory,
  handleCategoryChange,
  handleButtonClick,
}) {
  const handleExamClick = (year, month) => {
    // 진행 상태 초기화
    localStorage.removeItem('lastQuestionIndex');
    localStorage.removeItem('lastSelectedTime');

    // 해당 시험 페이지로 이동
    onExamClick(year, month);
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
            sx={{
              padding: '4px 8px',
              fontSize: '12px',
              minWidth: '60px',
            }}
          >
            {year}년
          </Button>
        ))}
      </Box>

      {/* 파일 업로드와 버튼 그룹 */}
      <Box className="button-group-container" mt={2}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
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
        <Button
          className="file-button"
          variant="contained"
          sx={{
            marginLeft: 1,
            fontSize: '12px',
            padding: '4px 8px',
          }}
          onClick={handleButtonClick}
        >
          파일 불러오기
        </Button>
      </Box>

      <TableContainer component={Paper} className="examTable" sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '6px', fontSize: '14px' }}>날짜</TableCell>
              <TableCell sx={{ padding: '6px', fontSize: '14px' }}>시험 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((record, index) => {
              const year = record.year;
              const month = record.examInfo.split(' ')[1].replace('월', '');

              return (
                <TableRow key={index} sx={{ height: '36px' }}>
                  {/* 행 높이 조정 */}
                  <TableCell sx={{ padding: '6px', fontSize: '12px' }}>{record.date}</TableCell>
                  <TableCell sx={{ padding: '6px', fontSize: '12px' }}>
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
    </>
  );
}

export default YearSelectionTable;
