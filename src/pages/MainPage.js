// MainPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import DashboardMenu from '../components/DashboardMenu';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

function MainPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
      // 비로그인 상태일 때만 모달을 열도록 조건 추가
      if (isAuthenticated === false) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  }, [isAuthenticated]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopNav />
        <Box sx={{ mt: 2, ml: 3 }}>
          <DashboardMenu />
        </Box>
        <Container maxWidth="md" sx={{ mt: 4, ml: 2 }}>
          <Box textAlign="center" mt={4}>
            {isAuthenticated ? (
              <>
                <Typography variant="h3" gutterBottom>
                  안녕하세요, {user?.userId || '사용자'}님!
                </Typography>
                <Typography variant="body1">
                  Memo에 오신 것을 환영합니다. 아래에서 새로운 메모를 작성하거나 기록을 관리해보세요!
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h3" gutterBottom>
                  환영합니다!
                </Typography>
                <Typography variant="body1">
                  Memo에 오신 것을 환영합니다. 로그인하거나 회원가입을 통해 더 많은 기능을 이용해보세요!
                </Typography>
              </>
            )}
          </Box>
        </Container>
        {/* 로그인 모달을 메인 페이지에서만 표시 */}
        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
