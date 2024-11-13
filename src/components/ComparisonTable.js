import React from 'react';

const ComparisonTable = ({ questionData, incorrectQuestionNumbers }) => {
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
          {questionData.map((question) => (
            <tr key={question.number}>
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
