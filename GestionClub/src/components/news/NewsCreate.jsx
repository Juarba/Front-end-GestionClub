import React, { useState, useCallback } from "react";
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { API_URL } from "../../services/api";
import "./NewsCreate.css";

const NewsCreate = ({ show, onClose, onNewsCreated, showToast }) => {
  const now = new Date();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    date: new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString(),
    dateInput: now.toISOString().split("T")[0],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToastLocal, setShowToastLocal] = useState(false);

  const resetForm = () => {
    const now = new Date();
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      date: new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString(),
      dateInput: now.toISOString().split("T")[0],
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const token = localStorage.getItem("jwtToken");
    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      const response = await fetch(`${API_URL}/News/UploadImage`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!response.ok) throw new Error("Error al subir imagen");
      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch {
      setErrorMessage("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(`${API_URL}/News/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al crear la noticia");

      setShowToastLocal(true);

      resetForm();
      onClose();
      onNewsCreated();
    } catch {
      setErrorMessage("Error al crear la noticia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Crear Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Título de la noticia"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Escriba aquí la descripción..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="dateInput"
                value={formData.dateInput}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const [hour, minute, second] = new Date()
                    .toTimeString()
                    .split(" ")[0]
                    .split(":");
                  const fullDate = new Date(
                    `${selectedDate}T${hour}:${minute}:${second}`
                  );
                  setFormData((prev) => ({
                    ...prev,
                    dateInput: selectedDate,
                    date: fullDate.toISOString(),
                  }));
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                {uploading
                  ? "Subiendo imagen..."
                  : formData.imageUrl
                  ? `Imagen cargada: ${formData.imageUrl}`
                  : "Arrastrá una imagen o hacé clic para subir"}
              </div>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              disabled={uploading || isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creando...
                </>
              ) : (
                "Crear Noticia"
              )}
            </Button>
          </Form>

          {errorMessage && (
            <Alert className="mt-3" variant="danger">
              {errorMessage}
            </Alert>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToastLocal(false)}
          show={showToastLocal}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Éxito</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Noticia creada exitosamente.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default NewsCreate;
