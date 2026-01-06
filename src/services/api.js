import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * - Base URL: 백엔드 API 서버 주소
 * - Timeout: 10초
 * - Headers: JSON 형식 통신
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * 추후 인증 토큰 등을 여기서 추가 가능
 */
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * 에러 처리를 일관되게 관리
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data?.message || '서버 오류가 발생했습니다.';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('서버와 연결할 수 없습니다.'));
    } else {
      return Promise.reject(new Error('요청 중 오류가 발생했습니다.'));
    }
  }
);

export default api;

