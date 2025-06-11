import React, { useState } from "react";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./LayoutNav.css";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import UserDropdown from "../userDropdown/UserDropdown";
import logo from "../../assets/LogoSinFondo.png"
import CourtManagerModal from "../courtManagerModal/CourtManagerModal";


const LayoutNav = () => {
  const [showCourtModal, setShowCourtModal] = useState(false);
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
    navigate("/userCenter");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNews = () => {
    navigate("/news");
  }

  const handleMonthlyFee = () => {
    navigate("/monthlyFee")
  }
  const handleManagerDashboard = () => {
    navigate("/managerDashboard")
  }

  const handleAvailability = () => {
    navigate("/disponibilidades");
  };

  //MERCADOPAGO
  const handlePagoPage = () => {
    navigate("/pago");
  };
  
  //Extrae el rol desde el token
  let userRole = null;
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole =
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ?? null;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const showMenu = userRole === "Admin" || userRole === "Gerente";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" >
      <img onClick={handleMainPage} src={logo} alt="Logo" style={{ width: 60, cursor: 'pointer' }} />
      <Container>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={handleMainPage} className="nav-link-hover-green fw-bold text-success">INICIO</Nav.Link>
            <Nav.Link onClick={handleNews} className="nav-link-hover-green">NOTICIAS</Nav.Link>
            <Nav.Link onClick={handleAboutUs} className="nav-link-hover-green">CONTACTO</Nav.Link>
            <Nav.Link onClick={handleBookingPage} className="nav-link-hover-green">RESERVAR CANCHA</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {showMenu && (
        <Nav className="ms-auto me-2">
          <Dropdown align="end">
            <Dropdown.Toggle variant="dark">
              <i className="bi bi-list" style={{ fontSize: "1.3rem" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleUserCenter}>
                Centro de Usuario
              </Dropdown.Item>
              <Dropdown.Item onClick={handleMonthlyFee}>
                Gestión de Cuotas
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowCourtModal(true)}>
                Gestión de Canchas

              </Dropdown.Item>
              <Dropdown.Item onClick={handleManagerDashboard}>
                Dashboard Gerencia

              </Dropdown.Item>
              <Dropdown.Item onClick={handleAvailability}>
                Gestion Disponibilidades
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      )}
      {isLoggedIn ? (
        <UserDropdown logout={logout} className="user-dropdown" />
      ) : (
        <Nav.Link
          onClick={handleLogin}
          className="rounded-pill nav-link-hover-green me-3"
        >
          Inicia Sesión
        </Nav.Link>
      )}
      <CourtManagerModal show={showCourtModal} onClose={() => setShowCourtModal(false)} />
    </Navbar>

  );
};

export default LayoutNav;
