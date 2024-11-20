import { useState, useEffect, useRef, useCallback } from 'react';

const getCurrentQuestionIndex = () => {
  return parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
};

const getElapsedTime = () => {
  return parseInt(localStorage.getItem('elapsedTime') || '0', 10);
};

const getStoredAnswers = () => {
  const savedAnswers = localStorage.getItem('answers');
  return savedAnswers ? JSON.parse(savedAnswers) : {};
};

function useQuestionStorage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getCurrentQuestionIndex());
  const [elapsedTime, setElapsedTime] = useState(getElapsedTime());
  const [answers, setAnswers] = useState(getStoredAnswers());
  const timerRef = useRef(null); // 타이머 ID를 저장할 useRef
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 여부

  // 문제 인덱스를 변경할 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

  // 타이머 시작
  const startTimer = useCallback(() => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem('elapsedTime', newTime); // 시간 저장
          return newTime;
        });
      }, 1000);
    }
  }, [isTimerRunning]);

  // 타이머 멈춤
  const stopTimer = useCallback(() => {
    if (isTimerRunning) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }
  }, [isTimerRunning]);

  // 타이머를 멈추고 데이터를 로컬 스토리지에 저장
  const pauseTimer = useCallback(() => {
    stopTimer();
    localStorage.setItem('elapsedTime', elapsedTime);
  }, [stopTimer, elapsedTime]);

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터를 가져와 타이머 시작
  useEffect(() => {
    const storedElapsedTime = getElapsedTime();
    setElapsedTime(storedElapsedTime);
    startTimer(); // 페이지 진입 시 타이머 시작

    return () => {
      stopTimer(); // 페이지 벗어날 때 타이머 정지
    };
  }, [startTimer, stopTimer]);

  // 답변이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  // 문제 인덱스, 경과 시간 및 답변을 초기화하고 타이머를 멈추는 함수
  const clearStorageData = useCallback(() => {
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('elapsedTime');
    localStorage.removeItem('answers');
    setAnswers({});
    setElapsedTime(0);
    stopTimer(); // 타이머 정지
  }, [stopTimer]);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    elapsedTime,
    setElapsedTime,
    answers,
    setAnswers,
    clearStorageData,
    startTimer,
    stopTimer,
    pauseTimer,
    isTimerRunning,
  };
}

export default useQuestionStorage;
