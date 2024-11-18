import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import { fetchRecentTest, fetchIncorrectQuestions } from '../api/questionsApi';
import { useNavigate } from 'react-router-dom';
import './MistakeNotePage.css';

function MistakeNotePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

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

          const testResultData = await fetchRecentTest(userId, yearAndMonth);
          console.log(`Fetched testResultData for ${yearAndMonth}:`, testResultData);

          const fetchedTestId = testResultData?.id;
          if (!fetchedTestId) {
            console.warn(`No test ID found for ${yearAndMonth}`);
            return { year, month, incorrectQuestions: [] };
          }

          const incorrectQuestions = await fetchIncorrectQuestions(fetchedTestId, userId, yearAndMonth);
          console.log(`Fetched incorrectQuestions for ${yearAndMonth}:`, incorrectQuestions);

          return { year, month, incorrectQuestions };
        });

        const categoriesData = await Promise.all(categoryPromises);
        setCategories(categoriesData);
      } catch (error) {
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [userId]);

  const handleCategoryToggle = (year, month) => {
    const categoryKey = `${year}-${month}`;
    setExpandedCategory((prev) => (prev === categoryKey ? null : categoryKey));
  };

  const handleQuestionClick = (number, year, month) => {
    navigate(`/solutions/${year}/${month}/number`, {
      state: { targetNumber: number },
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
              {categories.map(({ year, month, incorrectQuestions }) => {
                const categoryKey = `${year}-${month}`;
                return (
                  <div key={categoryKey}>
                    <ListItem
                      button
                      component="div"
                      onClick={() => handleCategoryToggle(year, month)}
                    >
                      <ListItemText primary={`${year}년 ${month}월 모의고사`} />
                      {expandedCategory === categoryKey ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={expandedCategory === categoryKey} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {incorrectQuestions.length > 0 ? (
                          incorrectQuestions.map((question) => (
                            <ListItem
                              button
                              component="div"
                              key={question.id}
                              onClick={() => handleQuestionClick(question.number, year, month)}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={`문제 번호: ${question.number}`} />
                            </ListItem>
                          ))
                        ) : (
                          <Typography sx={{ pl: 4 }}>오답 데이터가 없습니다.</Typography>
                        )}
                      </List>
                    </Collapse>
                  </div>
                );
              })}
            </List>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MistakeNotePage;
