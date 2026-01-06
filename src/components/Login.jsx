import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState(false);

  const showToast = () => {
    setShowToastMsg(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('모든 필드를 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.login(formData);
      authService.saveUser(userData);
      
      // 토스트 메시지 표시
      showToast();
      
      // 1초 후 대시보드로 이동
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 토스트 메시지 */}
      {showToastMsg && (
        <div className={styles.toast}>
          환영합니다! 🎉
        </div>
      )}
      
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>계정에 로그인하세요</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              사용자명
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="사용자명을 입력하세요"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className={styles.footer}>
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className={styles.link}
            disabled={loading}
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

