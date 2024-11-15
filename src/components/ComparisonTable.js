// src/components/ComparisonTable.js
import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchIncorrectQuestions } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';

const ComparisonTable = ({ id, yearAndMonth }) => {
  const { user } = useContext(AuthContext);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIncorrectQuestions = async () => {
      try {
        const data = await fetchIncorrectQuestions(id, user.userId, yearAndMonth);
        setIncorrectQuestions(data);
      } catch (error) {
        setError("Failed to load incorrect questions");
      } finally {
        setLoading(false);
      }
    };
    loadIncorrectQuestions();
  }, [id, user.userId, yearAndMonth]);

  if (loading) return <p>Loading incorrect questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <TableContainer component={Paper} style={{ maxHeight: 300, overflow: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>문제 번호</TableCell>
            <TableCell>정답 여부</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incorrectQuestions.map((question) => (
            <TableRow key={question.number}>
              <TableCell>{question.number}번</TableCell>
              <TableCell>X</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;
