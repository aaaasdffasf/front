//questionApi.js

import axiosInstance from './axiosInstance';

// 특정 연도와 월의 모든 문제 가져오기 (에러 구분 추가)
export const fetchQuestions = async (year, month) => {
  // 토큰 확인
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('인증 오류: 토큰이 없습니다. 로그인 후 다시 시도하세요.');
    throw new Error('인증 오류: 토큰이 없습니다.');
  } else {
    console.log('토큰이 유효합니다.');
  }

  try {
    // 요청 헤더에 토큰 추가
    const response = await axiosInstance.get(`/question/${year}/${month}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 스킴으로 토큰 전송
      },
    });
    // 각 문제에서 number, text, description 필드만 반환하도록 변환
    const questions = response.data.map(({ number, text, description }) => ({
      number,
      text,
      description,
    }));
    return questions;
  } catch (error) {
    // 에러 구분
    if (error.response) {
      // 서버가 응답을 반환했지만, 상태 코드가 2xx 범위에 있지 않을 때
      console.error(
        `Error fetching questions: Server responded with status ${error.response.status} - ${error.response.statusText}`
      );

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
          console.error(
            '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도하세요.'
          );
          break;
        default:
          console.error('알 수 없는 서버 오류가 발생했습니다.');
          break;
      }
    } else if (error.request) {
      // 요청이 만들어졌으나 서버로부터 응답이 없을 때 (네트워크 문제 가능성)
      console.error(
        'Error fetching questions: 서버로부터 응답이 없습니다. 네트워크 상태를 확인하세요.'
      );
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error(
        'Error fetching questions: 요청을 생성하는 과정에서 오류가 발생했습니다.',
        error.message
      );
    }

    throw error; // 에러를 호출한 쪽으로 다시 던짐
  }
};
