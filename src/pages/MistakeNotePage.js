import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import { fetchRecentTest, fetchIncorrectQuestions, fetchQuestions } from '../api/questionsApi';
import { useNavigate } from 'react-router-dom';
import './MistakeNotePage.css';

function MistakeNotePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.userId;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        setLoading(true);

        const yearMonthPairs = [
          { year: 24, month: 9 },
          { year: 23, month: 9 },
        ];

        const categoryPromises = yearMonthPairs.map(async ({ year, month }) => {
          const yearAndMonth = `${year}-${month}`;
          console.log(`Fetching data for ${yearAndMonth}`);

          const questions = await fetchQuestions(year, month);
          console.log(`Fetched questions for ${yearAndMonth}:`, questions);

          const testResultData = await fetchRecentTest(userId, yearAndMonth);
          console.log(`Fetched testResultData for ${yearAndMonth}:`, testResultData);

          const fetchedTestId = testResultData?.id;
          if (!fetchedTestId) {
            console.warn(`No test ID found for ${yearAndMonth}`);
            return { year, month, incorrectQuestions: [], score: 0 };
          }

          const incorrectQuestions = await fetchIncorrectQuestions(fetchedTestId, userId, yearAndMonth);
          console.log(`Fetched incorrectQuestions for ${yearAndMonth}:`, incorrectQuestions);

          const incorrectDetails = incorrectQuestions.map((incorrect) => {
            const question = questions.find((q) => q.number === incorrect.number);
            return {
              ...question,
              userAnswer: incorrect.userAnswer,
              isCorrect: false,
            };
          });

          return {
            year,
            month,
            incorrectQuestions: incorrectDetails,
            score: testResultData.score,
          };
        });

        const categoriesData = await Promise.all(categoryPromises);
        setCategories(categoriesData);
        console.log('Final categories data:', categoriesData);
      } catch (error) {
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [userId]);

  const handleCategoryClick = (year, month, incorrectDetails, score) => {
    navigate(`/mistake/solutions/${year}/${month}`, {
      state: { incorrectDetails, score },
    });
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
            <Typography variant="body1">틀린 문제를 다시 풀어보세요.</Typography>
          </Box>

          {loading ? (
            <Typography>Loading categories...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {categories.map(({ year, month, incorrectQuestions, score }) => (
                <ListItem
                  key={`${year}-${month}`}
                  button
                  component="div"
                  onClick={() =>
                    handleCategoryClick(year, month, incorrectQuestions, score)
                  }
                >
                  <ListItemText primary={`${year}년 ${month}월 모의고사`} />
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MistakeNotePage;
