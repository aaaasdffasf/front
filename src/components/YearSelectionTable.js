import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  TablePagination,
} from '@mui/material';

function YearSelectionTable({
  handleFileChange,
  fileInputRef,
  onExamClick,
  selectedCategory,
  handleCategoryChange,
}) {
  // 시험 데이터
  const historyData = [
    { year: '2024', date: '2024-11-14', examInfo: '2024년 수능' },
    { year: '2024', date: '2024-09-04', examInfo: '2024년 9월 모의고사' },
    { year: '2024', date: '2024-06-04', examInfo: '2024년 6월 모의고사' },
    { year: '2024', date: '2024-03-28', examInfo: '2024년 3월 모의고사' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 9월 모의고사' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 6월 모의고사' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // 연도 데이터 정리
    const uniqueYears = [...new Set(historyData.map((item) => item.year))];
    setYears(uniqueYears);

    // 검색 및 선택된 연도 필터링
    const filtered = historyData
      .filter((item) => item.year === selectedYear)
      .filter((item) =>
        item.examInfo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredData(filtered);
  }, [selectedYear, searchTerm]);

  const handleExamClick = (year, month) => {
    localStorage.removeItem('lastQuestionIndex');
    localStorage.removeItem('lastSelectedTime');
    onExamClick(year, month);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isTodayOrFuture = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    return examDate >= today;
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

      {/* 카테고리 버튼 */}
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
      <Box textAlign="center" mb={2}>
        <ButtonGroup>
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
        </ButtonGroup>
      </Box>

      {/* 검색 필드 */}
      <TextField
        variant="outlined"
        placeholder="시험 정보 검색"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: '600px', marginBottom: 2 }}
      />

      {/* 시험 테이블 */}
      {filteredData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 2,
              width: '100%',
              maxWidth: '800px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                    날짜
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                    시험 정보
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record, index) => {
                    const year = record.year;
                    const month = record.examInfo.split(' ')[1].replace('월', '');

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: isTodayOrFuture(record.date)
                            ? '#e3f2fd'
                            : 'inherit',
                        }}
                      >
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <span
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => handleExamClick(year, month)}
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
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" mt={2}>
          선택된 연도에 해당하는 시험 정보가 없습니다.
        </Typography>
      )}
    </Box>
  );
}

export default YearSelectionTable;
