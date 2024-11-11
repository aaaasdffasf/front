import { useState, useEffect, useRef } from 'react';

const getCurrentQuestionIndex = () => {
  return parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
};

const getElapsedTime = () => {
  return parseInt(localStorage.getItem('elapsedTime') || '0', 10);
};

// 로컬 스토리지에서 사용자가 입력한 답을 불러오는 함수
const getStoredAnswers = () => {
  const savedAnswers = localStorage.getItem('answers');
  return savedAnswers ? JSON.parse(savedAnswers) : {};
};

// 커스텀 훅 정의
function useQuestionStorage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getCurrentQuestionIndex());
  const [elapsedTime, setElapsedTime] = useState(getElapsedTime());
  const [answers, setAnswers] = useState(getStoredAnswers());
  const timerRef = useRef(null); // 타이머 ID를 저장할 useRef

  // 문제 인덱스를 변경할 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

  // 경과 시간을 업데이트할 때마다 로컬 스토리지에 저장
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        localStorage.setItem('elapsedTime', newTime); // 시간 저장
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 답변이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  // 문제 인덱스, 경과 시간 및 답변을 초기화하고 타이머를 멈추는 함수
  const clearStorageData = () => {
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('elapsedTime');
    localStorage.removeItem('answers');
    setAnswers({});
    setElapsedTime(0); // 시간 초기화
    clearInterval(timerRef.current); // 타이머 정지
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    elapsedTime,
    setElapsedTime,
    answers,
    setAnswers,
    clearStorageData,
  };
}

export default useQuestionStorage;
