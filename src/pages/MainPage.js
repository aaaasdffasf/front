import React, { useContext, useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const { setImageUrl } = useContext(ImageContext); // ImageContext에서 setImageUrl을 사용
  const [imageFile, setImageFile] = React.useState(null);
  // fileInputRef 정의
  const fileInputRef = useRef(null);

  // 파일 선택 핸들러
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

  // 분석 페이지로 이동
  const handleUploadAndAnalyze = () => {
    if (!imageFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    navigate('/analysis'); // 분석 페이지로 이동
  };

  const { clearStorageData } = useQuestionStorage();

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
      setIsModalOpen(!isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleExamClick = (year, month) => {
    clearStorageData();
  const [selectedCategory, setSelectedCategory] = useState('문제풀이'); // 카테고리 상태 추가

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
  

  const historyData = [
    { year: '2024', date: '2024-10-15', examInfo: '2024년 9월 시험' },
    { year: '2023', date: '2023-09-25', examInfo: '2023년 9월 시험' },
    { year: '2023', date: '2023-06-15', examInfo: '2023년 5월 시험' },
    { year: '2022', date: '2022-12-11', examInfo: '2022년 11월 시험' },
  ];
  const years = [...new Set(historyData.map((item) => item.year))];
  const filteredData = historyData.filter((record) => record.year === selectedYear);

  const handleButtonClick = () => {
    // fileInputRef.current.click()을 통해 파일 선택
    fileInputRef.current.click();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
          {isAuthenticated && (
            <YearSelectionTable
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              filteredData={filteredData}
              onExamClick={selectedCategory === '문제풀이' ? handleExamClick : handleSolutionClick}
            />
          )}
          <div>
            {/* File upload button */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}  // fileInputRef를 연결
              style={{ display: 'none' }}
            />
            <Button onClick={handleButtonClick} variant="contained">
              Choose Photo
            </Button>
          </div>
        </Container>
        {isAuthenticated === false && (
          <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
