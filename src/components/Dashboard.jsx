import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className={styles.title}>환영합니다!</h1>
          <p className={styles.subtitle}>{user.username}님</p>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>사용자 ID</span>
            <span className={styles.infoValue}>{user.id}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>사용자명</span>
            <span className={styles.infoValue}>{user.username}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>이메일</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>권한</span>
            <span className={styles.badge}>{user.role}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            로그아웃
          </button>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            로그인 성공! 백엔드 API와 정상적으로 연동되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

