import api from './api';

/**
 * 인증 관련 API 서비스
 */
const authService = {
  /**
   * 회원가입
   */
  register: async (signupData) => {
    try {
      const response = await api.post('/auth/register', signupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 로그인
   */
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 로컬 스토리지에 사용자 정보 저장
   */
  saveUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  /**
   * 로컬 스토리지에서 사용자 정보 가져오기
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * 로그아웃
   */
  logout: () => {
    localStorage.removeItem('user');
  },

  /**
   * 로그인 여부 확인
   */
  isAuthenticated: () => {
    return !!authService.getUser();
  },
};

export default authService;

