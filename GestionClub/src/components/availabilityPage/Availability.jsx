import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";
import "./Availability.css";

const getDaySpanish = (dayOfWeek) => {
  switch (dayOfWeek) {
    case "Sunday":
      return "Domingo";
    case "Monday":
      return "Lunes";
    case "Tuesday":
      return "Martes";
    case "Wednesday":
      return "Miércoles";
    case "Thursday":
      return "Jueves";
    case "Friday":
      return "Viernes";  
    case "Saturday":
      return "Sábado";
    default:
      return "Desconocido";
  }
};

const Availability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [updating, setUpdating] = useState(false);

  const getAvailabilities = async () => {
    const token = localStorage.getItem("jwtToken");
    fetch("https://localhost:7234/api/Availability/GetAll", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setAvailabilities(data))
      .catch((err) => {
        console.error("Error:", err);
        setToastMessage("Error al cargar disponibilidades");
        setToastVariant("danger");
        setShowToast(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getAvailabilities();
  }, []);

  const handleEdit = (availabilities) => {
    setSelectedAvailability(availabilities);
    setShowModal(true);
  };

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleCreateAvailabilities = async () => {
    const token = localStorage.getItem("jwtToken");
  }

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");
    if (availabilities.length == 0) {
      try {
        const res = await fetch(`https://localhost:7234/api/Availability/Create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startTime: selectedAvailability.startTime,
            finishTime: selectedAvailability.finishTime,
            duration: parseInt(selectedAvailability.duration, 10)
          }),
        });

        if (!res.ok) throw new Error("Error");

        setToastMessage("Disponibilidades creadas con éxito");
        setToastVariant("success");
        setShowToast(true);
        setShowModal(false);
        setUpdating(true);

        setTimeout(() => {
          setUpdating(false)
          getAvailabilities();
        }, 3000);

      } catch (error) {
        setToastMessage("Error al crear las disponibilidades");
        setToastVariant("danger");
        setShowToast(true);
      }
    }
    else{
      try {
        const res = await fetch(`https://localhost:7234/api/Availability/UpdateAvailability/${selectedAvailability.dayOfWeek}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startTime: selectedAvailability.startTime,
            finishTime: selectedAvailability.finishTime,
            duration: parseInt(selectedAvailability.duration, 10)
          }),
        });

        if (!res.ok) throw new Error("Error al actualizar");

        const updated = availabilities.map((u) => (u.id === selectedAvailability.id ? selectedAvailability : u));
        setAvailabilities(updated);
        setToastMessage("Usuario actualizado con éxito");
        setToastVariant("success");
        setShowToast(true);
        setShowModal(false);
      } catch (err) {
        setToastMessage(err.message);
        setToastVariant("danger");
        setShowToast(true);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAvailability({ ...selectedAvailability, [name]: value });
  };

  return (
    <Container className="usercenter-container">
      <h3 className="usercenter-title">Gestión de Disponibilidades</h3>

      {loading && <div className="spinner-center"><Spinner animation="border" /></div>}
      
      {updating && (
        <Alert variant="info" className="text-center">
          Actualizando la lista de disponibilidades...
        </Alert>
      )}

      <Table className="user-table" responsive>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Horario apertura</th>
            <th>Horario cierre</th>
            <th>Duracion de turnos (mins)</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.length > 0 ? (
            availabilities.map((a) => (
              <tr key={a.dayOfWeek}>
                <td>{getDaySpanish(a.dayOfWeek)}</td>
                <td>{a.startTime}</td>
                <td>{a.finishTime}</td>
                <td>{a.duration}</td>
                <td>
                  <Button variant="outline-secondary" className="me-2" onClick={() => handleEdit(a)}> <i class="bi bi-pencil-square"></i>Editar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay disponibilidades creadas. <br />
                <Button variant="success" className="me-2 mt-2" onClick={handleShowModal}>Crear Disponibilidades</Button>
                </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Ingresar datos</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hora inicio</Form.Label>
              <Form.Control className="enter-data-input" name="startTime" placeholder="HH:MM:SS" value={selectedAvailability?.startTime || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora fin</Form.Label>
              <Form.Control name="finishTime" className="enter-data-input" placeholder="HH:MM:SS" value={selectedAvailability?.finishTime || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duración de las reservas</Form.Label>
              <Form.Control name="duration" className="enter-data-input" placeholder="minutos" value={selectedAvailability?.duration || ""} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg={toastVariant} autohide delay={3000} onClose={() => setShowToast(false)}>
          <Toast.Header><strong className="me-auto">Notificación</strong></Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Availability;
