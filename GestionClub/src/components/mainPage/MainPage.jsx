import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card } from 'react-bootstrap';

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
        <h1>GestionClub</h1>

         {/* Beneficios */}
     
      </div>
      <div className="mainpage-content">
       <section className="section-solid section-light">
  <h2>Beneficios de ser parte</h2>
  <Container className="mt-4">
    <Row className="justify-content-center g-4">
      <Col md={4}>
        <Card className="h-100 text-center shadow-sm benefit-card">
          <Card.Body>
            <Card.Title>🎾 Canchas Profesionales</Card.Title>
            <Card.Text>
              Césped sintético, techadas y con excelente iluminación.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="h-100 text-center shadow-sm benefit-card">
          <Card.Body>
            <Card.Title>🕐 Turnos Flexibles</Card.Title>
            <Card.Text>
              Reservá tu cancha los 7 días de la semana desde la app.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="h-100 text-center shadow-sm benefit-card">
          <Card.Body>
            <Card.Title>🏆 Torneos Mensuales</Card.Title>
            <Card.Text>
              Competí, conocé gente y ganá premios exclusivos.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
</section>


      </div> 
    </div>

  );
};

export default MainPage;
