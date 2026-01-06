import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = '사용자명을 입력해주세요.';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = '사용자명은 3~20자 사이여야 합니다.';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = '사용자명은 영문과 숫자만 가능합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // 혹시 남아 있을지 모르는 로그인 세션 강제 종료
      authService.logout();

      const { confirmPassword, ...signupData } = formData;
      await authService.register(signupData);

      // 회원가입만 완료 -> 바로 로그인 페이지로 이동 (토스트/자동 로그인 없음)
      navigate('/login', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || '회원가입에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>새 계정을 만드세요</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.general && (
            <div className={styles.errorBox}>
              {errors.general}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              사용자명 *
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="3~20자, 영문/숫자만"
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일 *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="example@email.com"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호 *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="최소 8자, 영문/숫자 포함"
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              비밀번호 확인 *
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="비밀번호 재입력"
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className={styles.footer}>
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={styles.link}
            disabled={loading}
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;

