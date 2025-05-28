import React, { useState, useCallback, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { API_URL } from "../../services/api";

const NewsCreate = ({ show, onClose, onNewsCreated, showToast }) => {
 const now = new Date();
const [formData, setFormData] = useState({
  title: "",
  description: "",
  imageUrl: "",
  date: now.toISOString(), // para enviar al backend
  dateInput: now.toISOString().split("T")[0], // para mostrar en el input
});

const resetForm = () => {
  const now = new Date();
  setFormData({
    title: "",
    description: "",
    imageUrl: "",
    date: now.toISOString(),
    dateInput: now.toISOString().split("T")[0],
  });
};


  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  

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
      const imageUrl = await response.text();
      setFormData((prev) => ({ ...prev, imageUrl }));
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
      showToast("Noticia creada correctamente.");
      resetForm();
      onClose();
      onNewsCreated();
    } catch {
      setErrorMessage("Error al crear la noticia.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Crear Noticia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Fecha</Form.Label>
  <Form.Control
    type="date"
    name="dateInput"
    value={formData.dateInput || ""}
    onChange={(e) => {
      const selectedDate = e.target.value;
      const now = new Date();
      const [hour, minute, second] = now
        .toTimeString()
        .split(" ")[0]
        .split(":");

      const fullDate = new Date(`${selectedDate}T${hour}:${minute}:${second}`);

      setFormData((prev) => ({
        ...prev,
        dateInput: selectedDate,
        date: fullDate.toISOString(), // mantiene hora actual
      }));
    }}
    required
  />
</Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <div
              {...getRootProps()}
              style={{ border: "2px dashed #aaa", padding: "20px", textAlign: "center", backgroundColor: isDragActive ? "#eee" : "#fff" }}
            >
              <input {...getInputProps()} />
              {uploading
                ? "Subiendo imagen..."
                : formData.imageUrl
                ? `Imagen cargada: ${formData.imageUrl}`
                : "Arrastrá una imagen o hacé clic para subir"}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={uploading}>
            Crear Noticia
          </Button>
        </Form>
        {errorMessage && <Alert className="mt-3" variant="danger">{errorMessage}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default NewsCreate;
