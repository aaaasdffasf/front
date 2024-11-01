// ProblemPage.js

import React, { useState } from 'react';

const ProblemPage = () => {
  // 예시 문제와 상태 관리
  const problem = {
    question: "2 + 2는 무엇인가요?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);

  // 선택된 옵션 변경 핸들러
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === problem.answer) {
      setResult("정답입니다!");
    } else {
      setResult("오답입니다. 다시 시도해보세요.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>문제</h1>
      <p>{problem.question}</p>
      <form onSubmit={handleSubmit}>
        {problem.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          </div>
        ))}
        <button type="submit" style={{ marginTop: "10px" }}>
          제출
        </button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
};

export default ProblemPage;
