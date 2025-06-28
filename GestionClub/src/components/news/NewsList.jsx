import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Container,
  Button,
  Modal,
  Toast,
} from "react-bootstrap";
import { API_URL } from "../../services/api";
import { jwtDecode } from "jwt-decode";

import "./NewsList.css";

const NewsList = ({ refresh }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("jwtToken");
  let userRole = null;
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

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_URL}/News/GetAll`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cargar noticias");
      const data = await response.json();
      setNews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(news);
  useEffect(() => {
    fetchNews();
  }, [refresh]);

  const handleDelete = async (item) => {
    const token = localStorage.getItem("jwtToken");
    setIsDeleting(true);
    

    try {
      const response = await fetch(`${API_URL}/News/Delete/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("No se pudo eliminar la noticia");

      setNews((prev) => prev.filter((n) => n.id !== item.id));
      setToastVariant("success");
      setToastMessage("Noticia eliminada con éxito.");
      setShowModal(false);
    } catch (err) {
      setToastVariant("danger");
      setToastMessage(err.message);
    } finally {
      setIsDeleting(false);
      setShowToast(true);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Container className="card-container">
        {news.map((item) => (
          <Card key={item.id} className="news-card card-body">
            <div className="news-date-label">
              {new Intl.DateTimeFormat("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(item.date))}
            </div>

            {item.imageUrl && (
              <Card.Img
                variant="top"
                src={item.imageUrl}
                className="news-image"
              />
            )}

            <Card.Body>
              <Card.Title className="news-title">{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              {(userRole === "CM" ||
                userRole === "Admin") && (
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                  >
                    {" "}
                    <i className="bi bi-trash" /> Eliminar
                  </Button>
                )}
            </Card.Body>
          </Card>
        ))}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que querés eliminar la noticia: "
          <strong>{selectedItem?.title}</strong>"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => handleDelete(selectedItem)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Eliminando...
              </>
            ) : (
              <>
                <i className="bi bi-trash" /> Eliminar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg={toastVariant}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          minWidth: "250px",
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Notificación</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default NewsList;
