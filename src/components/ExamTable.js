// import React, { useContext, useEffect, useState } from 'react';
// import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// const ExamTable = ({ customClass }) => {
//   const [selectedYear, setSelectedYear] = useState('2024');

//   const historyData = [
//     { year: '2024', date: '2024-10-15', examInfo: '2024년 9월 시험' },
//     { year: '2023', date: '2023-09-25', examInfo: '2023년 8월 시험' },
//     { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
//     { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
//   ];

//    // 고유 연도 목록을 가져오기
//   const years = [...new Set(historyData.map((item) => item.year))];

//    // 선택한 연도에 해당하는 데이터 필터링
//   const filteredData = historyData.filter((record) => record.year === selectedYear);

//   return (
//     {/* 연도 선택 카테고리 */}
//     <Box>
//       {years.map((year) => (
//         <Button 
//           key={year} 
//           onClick={() => setSelectedYear(year)}
//           variant={selectedYear === year ? 'contained' : 'outlined'}
//           style={{ marginRight: 8 }}
//         >
//           {year}년
//         </Button>
//       ))}
//     </Box>

//   {/* 테이블 컨테이너 */}
//   <TableContainer component={Paper} className="examTable" >
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>날짜</TableCell>
//           <TableCell>시험 정보</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {filteredData.map((record, index) => (
//           <TableRow key={index}>
//             <TableCell>{record.date}</TableCell>
//             <TableCell>{record.examInfo}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
//   )
// }

// export default ExamTable;