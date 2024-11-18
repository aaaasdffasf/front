// questionsApi.js
import axiosInstance from './axiosInstance';

// 특정 연도와 월의 모든 문제 가져오기
export const fetchQuestions = async (year, month) => {
  try {
    const response = await axiosInstance.get(`/question/${year}/${month}`);

    if (response.status === 204) {
      console.warn("No questions found for the specified year and month.");
      return [];
    }

    if (Array.isArray(response.data)) {
      const questions = response.data.map(({ number, text, description }) => ({
        number,
        text,
        description,
      }));
      return questions;
    } else {
      console.error("Expected an array but received:", response.data);
      throw new Error("Invalid data format: Expected an array of questions");
    }
  } catch (error) {
    handleApiError(error, "fetching questions");
    throw error;
  }
};

// 답안을 백엔드로 제출하기
export const submitAnswers = async (userId, year, month, userAnswer, testTime) => {
  try {
    const response = await axiosInstance.post(
      `/test/submit`,
      userAnswer,
      {
        params: { userId, year, month, testTime },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "submitting answers");
    throw error;
  }
};

// 특정 사용자와 연/월에 따른 모든 시험 기록 가져오기
export const fetchAllTests = async (userId, yearAndMonth) => {
  try {
    const response = await axiosInstance.get('/test/getAllTest', {
      params: { userId, yearAndMonth },
    });
    return response.data; // 모든 시험 기록 반환
  } catch (error) {
    handleApiError(error, "fetching all tests");
    throw error;
  }
};

// 특정 시험 결과 가져오기 함수
export const fetchTestResult = async (id, userId, yearAndMonth) => {
  try {
    const response = await axiosInstance.get(`/test/getTest`, {
      params: { id, userId, yearAndMonth },
    });
    return response.data; // 시험 전체 결과 반환
  } catch (error) {
    handleApiError(error, "fetching test result");
    throw error;
  }
};

// 특정 사용자와 연/월에 대한 최신 시험 결과 가져오기 함수
export const fetchRecentTest = async (userId, yearAndMonth) => {
  try {
    const response = await axiosInstance.get('/test/getRecentTest', {
      params: {userId, yearAndMonth},
    });
    return response.data; // 성공 시 시험지 데이터를 반환
  } catch (error) {
    handleApiError(error, "fetching recent test");
    throw error; // 오류 발생 시 오류를 다시 던짐
  }
};

// 틀린 문제만 가져오는 함수
export const fetchIncorrectQuestions = async (id, userId, yearAndMonth) => {
  try {
    const response = await axiosInstance.get(`/test/incorrectQuestions`, {
      params: { id, userId, yearAndMonth },
    });
    return response.data; // 틀린 문제 목록 반환
  } catch (error) {
    handleApiError(error, "fetching incorrect questions");
    throw error;
  }
};

// 공통 에러 핸들링 함수
function handleApiError(error, action) {
  if (error.response) {
    console.error(`Error ${action}: ${error.response.status} - ${error.response.statusText}`);
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
    console.error(`Error ${action}: No response from server.`);
  } else {
    console.error(`Error ${action}:`, error.message);
  }
}
