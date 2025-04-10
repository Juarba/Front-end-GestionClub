import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LayoutNav = () => {
    const navigate = useNavigate();

    const handleMainPage = () => {
        navigate("/")
    }

    const handleBookingPage = () => {
        navigate("/booking")
    }

    const handleAboutUs = () => {
        navigate("/aboutUs")
    }

    const handleLogin = () => {
        navigate("/login")
    }
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" fixed="top" className="w-100">
            <Container fluid>
                <Navbar.Brand onClick={handleMainPage}>Logo</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={handleBookingPage}>Reservar cancha</Nav.Link>
                    <Nav.Link onClick={handleAboutUs}>Sobre nosotros</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    <Nav.Link onClick={handleLogin}>Login</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default LayoutNav;
