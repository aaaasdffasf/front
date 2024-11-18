import React, { useContext, useEffect, useState, useRef } from 'react';
import { Container, Box, Typography, ButtonGroup, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import DashboardMenu from '../components/DashboardMenu';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import YearSelectionTable from '../components/YearSelectionTable';
import { useNavigate } from 'react-router-dom';
import useQuestionStorage from '../hooks/useQuestionStorage';
import { ImageContext } from '../context/ImageContext';

function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { setImageUrl } = useContext(ImageContext); // ImageContext에서 setImageUrl을 사용
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('문제풀이');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { clearStorageData } = useQuestionStorage();

  const handleExamClick = (year, month) => {
    clearStorageData();
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/questions/${year.slice(2)}/${month}`);
  };

  const handleSolutionClick = (year, month) => {
    clearStorageData();
    localStorage.setItem('lastSelectedYear', year.slice(2)); // 연도 저장
    localStorage.setItem('lastSelectedMonth', month);        // 월 저장
    navigate(`/solutions/${year.slice(2)}/${month}`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // 이미지 URL을 ImageContext에 저장
        navigate('/analysis'); // 파일이 선택되면 자동으로 Analysis 화면으로 이동
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line no-unused-vars
const handleUpload = () => {
  if (imageFile) {
      console.log("Uploading file:", imageFile);
  }
};

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
      setIsModalOpen(!isAuthenticated);
    }
  }, [isAuthenticated]);

  const historyData = [
    { year: '2024', date: '2024-10-15', examInfo: '2024년 9월 시험' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 9월 시험' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];

  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);

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

          {/* 카테고리 버튼 그룹 */}
          {isAuthenticated && (
            <Box textAlign="center" mt={2} mb={4}>
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
          )}

          {/* 선택된 카테고리에 따라 YearSelectionTable 표시 */}
          {isAuthenticated && (
            <YearSelectionTable
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              filteredData={filteredData}
              onExamClick={selectedCategory === '문제풀이' ? handleExamClick : handleSolutionClick}
            />
          )}

          {/* File upload button */}
          <Box textAlign="center" mt={4}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button onClick={handleButtonClick} variant="contained">
              사진 선택
            </Button>
          </Box>
        </Container>

        {/* 로그인 모달 */}
        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
