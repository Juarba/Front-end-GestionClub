import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './LayoutNav.css';

const LayoutNav = () => {
  const navigate = useNavigate();

  const handleMainPage = () => {
    navigate("/");
  };

  const handleBookingPage = () => {
    navigate("/booking");
  };

  const handleAboutUs = () => {
    navigate("/aboutUs");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
    <Container>
      <Navbar.Brand onClick={handleMainPage} className="fw-bold">Gestion Club</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="me-auto">
          <Nav.Link onClick={handleMainPage} className="nav-link-hover-green fw-bold text-success">INICIO</Nav.Link>
          <Nav.Link onClick={handleAboutUs} className="nav-link-hover-green">CLUB</Nav.Link>
          <Nav.Link onClick={handleAboutUs} className="nav-link-hover-green">SERVICIOS</Nav.Link>
          <Nav.Link onClick={handleBookingPage} className="nav-link-hover-green">ACTIVIDADES</Nav.Link>
          <Nav.Link onClick={handleAboutUs} className="nav-link-hover-green">CONTACTO</Nav.Link>
        </Nav>
        <Nav className="me-auto">
        <Nav.Link onClick={handleLogin}  className="rounded-pill nav-link-hover-green">Inicia Sesion</Nav.Link>
        <Button onClick={handleBookingPage} variant="success" className="rounded-pill nav-link-hover-white">RESERVAR CANCHA</Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default LayoutNav;
