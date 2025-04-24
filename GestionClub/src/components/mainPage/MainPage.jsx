import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MainPage.css';

const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setMessage('Inicio de sesión exitoso');
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleLogout = () => {
    logout();           // limpia token y estado global
    navigate('/login'); // redirige al login
  };

  return (
    <div className="mainpage-background">
      <div className="mainpage-message-wrapper">
        {message && <div className="mainpage-success-message">{message}</div>}
      </div>

      <div className="mainpage-content">
        <h1>Bienvenido a la MainPage</h1>
        <p>Esta es la página principal de tu aplicación.</p>

        
      </div>
    </div>
  );
};

export default MainPage;
