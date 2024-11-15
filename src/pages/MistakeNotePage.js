import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import { fetchRecentTest, fetchIncorrectQuestions } from '../api/questionsApi';
import { useNavigate, useParams } from 'react-router-dom';
import './MistakeNotePage.css';

function MistakeNotePage() {
  const { user } = useContext(AuthContext); // 사용자 인증 정보
  const navigate = useNavigate();
  const { year, month } = useParams(); // URL에서 연도와 월을 가져옵니다.
  const [incorrectQuestions, setIncorrectQuestions] = useState([]); // 틀린 문제 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [testId, setTestId] = useState(null); // 최신 시험 ID

  const userId = user?.userId; // 사용자 ID
  const yearAndMonth = `${year}-${month}`; // 연도와 월 조합

  useEffect(() => {
    const loadTestIdAndIncorrectQuestions = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        setLoading(true);

        // 최신 시험 결과에서 testId 가져오기
        const testResultData = await fetchRecentTest(userId, yearAndMonth);
        const fetchedTestId = testResultData?.id;

        if (!fetchedTestId) {
          setError('최신 시험 ID를 가져올 수 없습니다.');
          return;
        }

        setTestId(fetchedTestId);

        // 틀린 문제 데이터를 가져오기
        const incorrectData = await fetchIncorrectQuestions(fetchedTestId, userId, yearAndMonth);
        setIncorrectQuestions(incorrectData);
      } catch (error) {
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestIdAndIncorrectQuestions();
  }, [userId, yearAndMonth]);

  const handleQuestionClick = (number) => {
    // 특정 문제 번호 클릭 시 SolutionsPage로 이동
    navigate(`/solutions/${year}/${month}/number`, { state: { targetNumber: number } });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopNav />
        <Container maxWidth="md" sx={{ mt: 4, ml: 2 }}>
          <Box textAlign="center" mt={4}>
            <Typography variant="h4" gutterBottom>
              오답노트
            </Typography>
            <Typography variant="body1">
              틀린 문제를 다시 풀어보세요.
            </Typography>
          </Box>

          {loading ? (
            <Typography>Loading incorrect questions...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary">
                Test ID: {testId}
              </Typography>
              <List>
                {incorrectQuestions.length > 0 ? (
                  incorrectQuestions.map((question, index) => (
                    <ListItem
                      button={true}
                      key={question.id || index}
                      onClick={() => handleQuestionClick(question.number)}
                    >
                      <ListItemText
                        primary={`시험 날짜: 20${question.year}년-${question.month}월, 문제 번호: ${question.number}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>오답 데이터가 없습니다.</Typography>
                )}
              </List>
            </>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MistakeNotePage;
