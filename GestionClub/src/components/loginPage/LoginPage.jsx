import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>

        <div className="login-toggle">
          <Button variant="dark" className="login-toggle-button">Iniciar Sesión</Button>
          <Button variant="success" className="login-toggle-button text-white">Registrarme</Button>
        </div>

        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" placeholder="Ingresa tu correo" />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" />
            <div className="forgot-password">
              <a href="#">¿Olvidó contraseña?</a>
            </div>
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100 mt-3">
            Iniciar Sesión
          </Button>
        </Form>

        <div className="register-prompt">
          <small>¿No tienes una cuenta? <a href="#">Regístrate</a></small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;