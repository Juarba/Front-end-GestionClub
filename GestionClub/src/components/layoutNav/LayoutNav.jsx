import React from "react";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './LayoutNav.css';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import UserDropdown from "../userDropdown/UserDropdown";
import logo from "../../assets/LogoSinFondo.png"


const LayoutNav = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleMainPage = () => {
    navigate("/");
  };

  const handleBookingPage = () => {
    navigate("/booking");
  };

  const handleAboutUs = () => {
    navigate("/aboutUs");
  };

  const handleServicePage = () => {
    navigate("/servicePage");
  };

  const handleUserCenter = () => {
    navigate("/userCenter")
  }

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNews = () => {
    navigate("/news");
  }

  //Extrae el rol desde el token
  let userRole = null;
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const showMenu = userRole === "Admin" || userRole === "Gerente";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <img onClick={handleMainPage}  src={logo} alt="Logo" className="mb-3" style={{ width: 100, cursor: 'pointer' }} />
      <Container>
        <Navbar.Brand onClick={handleMainPage} className="fw-bold" style={{ cursor: 'pointer' }}>Gestion Club</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={handleMainPage} className="nav-link-hover-green fw-bold text-success">INICIO</Nav.Link>
            <Nav.Link onClick={handleServicePage} className="nav-link-hover-green">SERVICIOS</Nav.Link>
            <Nav.Link onClick={handleNews} className="nav-link-hover-green">CLUB</Nav.Link>
            <Nav.Link onClick={handleBookingPage} className="nav-link-hover-green">ACTIVIDADES</Nav.Link>
            <Nav.Link onClick={handleAboutUs} className="nav-link-hover-green">CONTACTO</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            <Button onClick={handleBookingPage} variant="success" className="rounded-pill nav-link-hover-white">RESERVAR CANCHA</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {showMenu && (
        <Nav className="ms-auto me-2">
          <Dropdown align="end">
            <Dropdown.Toggle variant="dark">
              <i class="bi bi-list" style={{ fontSize: "1.3rem" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleUserCenter}>
                Centro de Usuario
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      )}
      {isLoggedIn ? (
        <UserDropdown logout={logout} className="user-dropdown" />
      ) : (
        <Nav.Link onClick={handleLogin} className="rounded-pill nav-link-hover-green me-3">
          Inicia Sesión
        </Nav.Link>
      )}
    </Navbar>
  );
};

export default LayoutNav;
