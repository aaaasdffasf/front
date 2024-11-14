// src/pages/MistakeNotePage.js
import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import { fetchIncorrectQuestions } from '../api/questionsApi';
import { useNavigate, useParams } from 'react-router-dom';
import './MistakeNotePage.css';

function MistakeNotePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { year, month } = useParams();
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.userId;
  const yearAndMonth = `${year}-${month}`;
  const testId = 59;

  useEffect(() => {
    const loadIncorrectQuestions = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        setLoading(true);

        const incorrectData = await fetchIncorrectQuestions(testId, userId, yearAndMonth);
        console.log("Fetched incorrect questions data:", incorrectData);

        setIncorrectQuestions(incorrectData);
      } catch (error) {
        setError('오답 데이터를 불러오지 못했습니다.');
        console.error("Error fetching incorrect questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncorrectQuestions();
  }, [userId, yearAndMonth]);

  const handleQuestionClick = (year, month, number) => {
    navigate(`/solutions/${year}/${month}/${number}`);
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
            <List>
              {incorrectQuestions.length > 0 ? (
                incorrectQuestions.map((question, index) => (
                  <ListItem
                    button={true}
                    key={question.id || index}
                    onClick={() => handleQuestionClick(question.year, question.month, question.number)}
                  >
                    <ListItemText
                      primary={`시험 날짜: ${question.year}-${question.month}, 문제 번호: ${question.number}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>오답 데이터가 없습니다.</Typography>
              )}
            </List>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MistakeNotePage;
