import React, { useEffect, useState } from "react";
import { Container, Toast, ToastContainer, Button } from "react-bootstrap";
import NewsList from "./NewsList";
import NewsCreate from "./NewsCreate";
import { jwtDecode } from "jwt-decode";
import './NewsDashboard.css';

const NewsDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [newsUpdated, setNewsUpdated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const puedeCrearNoticia = userRole === "Admin" || userRole === "CM";

  const handleNewsCreated = () => {
    setNewsUpdated(!newsUpdated);
  };

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <Container className="news-dashboard-container">
      <h1 className="dashboard-title">Noticias del Club</h1>
      {puedeCrearNoticia && (
        <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
          Crear Noticia
        </Button>
      )}
      <NewsList refresh={newsUpdated} />
      <NewsCreate
        show={showModal}
        onClose={() => setShowModal(false)}
        onNewsCreated={handleNewsCreated}
        showToast={triggerToast}
      />
      <ToastContainer className="toast-center" position="top-center">
        <Toast show={showToast} bg="success" onClose={() => setShowToast(false)} delay={4000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default NewsDashboard;