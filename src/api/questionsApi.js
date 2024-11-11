// questionApi.js
import axiosInstance from './axiosInstance';

// 특정 연도와 월의 모든 문제 가져오기
export const fetchQuestions = async (year, month) => {
  try {
    const response = await axiosInstance.get(`/question/${year}/${month}`);
    const questions = response.data.map(({ number, text, description }) => ({
      number,
      text,
      description,
    }));
    return questions;
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching questions: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      console.error('Error fetching questions: No response from server.');
    } else {
      console.error('Error fetching questions:', error.message);
    }
    throw error;
  }
};

// 답안을 백엔드로 제출하기
export const submitAnswers = async (userId, year, month, userAnswer, testTime) => {
  try {
    const response = await axiosInstance.post(
      `/test/submit`, 
      userAnswer, // `userAnswer` 배열을 JSON 배열 형식으로 전송
      {
        params: { // @RequestParam으로 전달될 값들
          userId,
          year,
          month,
          testTime,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error submitting answers: ${error.response.status} - ${error.response.statusText}`);
      // 상태 코드에 따른 구체적인 처리
      switch (error.response.status) {
        case 400:
          console.error('잘못된 요청입니다. 요청 파라미터를 확인하세요.');
          break;
        case 401:
          console.error('인증 오류입니다. 로그인 상태를 확인하세요.');
          break;
        case 403:
          console.error('접근이 거부되었습니다. 권한을 확인하세요.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error('서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
          break;
        default:
          console.error('알 수 없는 서버 오류가 발생했습니다.');
          break;
      }
    } else if (error.request) {
      console.error('Error submitting answers: No response from server.');
    } else {
      console.error('Error submitting answers:', error.message);
    }
    throw error;
  }
};