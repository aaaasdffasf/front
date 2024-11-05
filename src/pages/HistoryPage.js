//학습 기록

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 왼쪽 화살표 아이콘
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // 오른쪽 화살표 아이콘
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 임포트
import TopNav from '../components/TopNav';

function Analysis() {
  return (
    <div style={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar />

      <div style={{ flex: 1 }}>
        {/* 상단 네비게이션 바 */}
        <TopNav />

        <div style={{ backgroundColor: '#F3F6FE', minHeight: '91vh', paddingTop: '2px', display: 'flex', flexDirection: 'column' }}>
          {/* 컨텐츠 영역 */}
          <Box
            sx={{
              height: '50vh', // 높이를 화면의 50vh로 설정
              flex: 1, // 남은 공간을 모두 차지하도록 설정
              backgroundColor: 'white', // 내용의 가독성을 위해 흰색 배경 설정
              borderRadius: 3,
              textAlign: 'center',
              p: 1, // 패딩을 줄여 여백을 줄임
              mx: 2, // 좌우 여백 추가
              my: 2, // 상하 여백 추가
              position: 'relative', // 작은 박스를 위한 상대 위치 설정
            }}
          >
            {/* 시험 문제 영역을 두 개의 박스로 나누기 */}
            <Box
              sx={{
                marginTop: '10px', // 작은 박스 아래로 밀어내기 위해 여백 추가
                height: '600px', // 남은 공간을 모두 차지하도록 높이 계산
                display: 'flex', // 내부 콘텐츠 정렬을 위한 flex 설정
                flexDirection: 'row', // 두 개의 박스를 가로로 배치
                borderRadius: 3, // 둥근 모서리
                overflow: 'hidden', // 내용이 넘치는 것을 방지
              }}
            >
              {/* 첫 번째 박스 */}
              <Box
                sx={{
                  flex: 1, // 남은 공간을 모두 차지하도록 설정
                  backgroundColor: '#e0e0e0', // 첫 번째 박스의 배경색
                  borderRadius: '3px 0 0 3px', // 둥근 모서리
                  display: 'flex',
                  flexDirection: 'column', // 세로 방향으로 배치
                  justifyContent: 'center', // 수직 중앙 정렬
                  alignItems: 'center', // 수평 중앙 정렬
                  position: 'relative', // 상대 위치 설정
                  p: 1, // 패딩 추가
                }}
              >
                <Typography variant="body1" sx={{ textAlign: 'center' }}>학습 기록</Typography>
              </Box>

              {/* 두 번째 박스 */}
              <Box
                sx={{
                  flex: 1, // 남은 공간을 모두 차지하도록 설정
                  backgroundColor: '#d0d0d0', // 두 번째 박스의 배경색
                  borderRadius: '0 3px 3px 0', // 둥근 모서리
                  display: 'flex',
                  flexDirection: 'column', // 세로 방향으로 배치
                  justifyContent: 'flex-start', // 상단 정렬
                  alignItems: 'flex-end', // 오른쪽 정렬
                  position: 'relative', // 상대 위치 설정
                  p: 1, // 패딩 추가
                }}
              >
                {/* 버튼 영역 */}
                <Box sx={{ display: 'flex', mb: 1 }}> {/* mb: 1 to add margin at the bottom */}
                  <Button sx={{ mr: 1, backgroundColor: '#F3F6FE' }}>
                    <ArrowBackIcon /> {/* 왼쪽 아이콘 */}
                  </Button>
                  <Button sx={{ backgroundColor: '#F3F6FE' }}>
                    <ArrowForwardIcon /> {/* 오른쪽 아이콘 */}
                  </Button>
                </Box>
                {/* 문구 영역 */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1">최근 푼 문제</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
