import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { useAuth } from '../../context/AuthContext';
import { authenticateUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await authenticateUser(email, password);
      login(token);
      setMessage('Inicio de sesión exitoso');
      navigate('/', { state: { loginSuccess: true } });
    } catch (error) {
      setMessage('Usuario o contraseña incorrectos');
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>

        <div className="login-toggle">
          <Button variant="dark" className="login-toggle-button">Iniciar Sesión</Button>
          <Button variant="success" onClick={navigateToRegister} className="login-toggle-button text-white">Registrarme</Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Ingresa tu correo" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <div className="forgot-password">
              <a href="#">¿Olvidó contraseña?</a>
            </div>
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100 mt-3">
            Iniciar Sesión
          </Button>
        </Form>

        {message && (
          <div className={`mt-3 ${message.includes('exitoso') ? 'text-success' : 'text-danger'}`}>
            {message}
          </div>
        )}

        <div className="register-prompt">
          <small>¿No tienes una cuenta? <a href="#" onClick={navigateToRegister}>Regístrate</a></small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
