import React from 'react';

const ComparisonTable = ({ questionData, incorrectQuestionNumbers, setCurrentQuestionIndex }) => {
  const handleRowClick = (index) => {
    setCurrentQuestionIndex(index); // 문제 번호 클릭 시 해당 문제로 이동
  };

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>문제 번호</th>
            <th>결과</th>
          </tr>
        </thead>
        <tbody>
          {questionData.map((question, index) => (
            <tr key={question.number} onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }}>
              <td>{question.number}</td>
              <td>{incorrectQuestionNumbers.includes(question.number) ? 'X' : 'O'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
