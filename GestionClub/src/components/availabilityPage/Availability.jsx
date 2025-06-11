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

  useEffect(() => {
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
  }, []);

  const handleEdit = (availabilities) => {
    setSelectedAvailability(availabilities);
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");
    console.log(selectedAvailability)
    try {
      const res = await fetch(`https://localhost:7234/api/Availability/UpdateAvailability/${selectedAvailability.dayOfWeek}`, {
        //https://localhost:7234/api/Availability/UpdateAvailability/1
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
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAvailability({ ...selectedAvailability, [name]: value });
  };

  return (
    <Container className="usercenter-container">
      <h3 className="usercenter-title">Gestión de Disponibilidades</h3>

      {loading && <div className="spinner-center"><Spinner animation="border" /></div>}

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
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(a)}>Editar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modales y Toast */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Editar</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hora inicio</Form.Label>
              <Form.Control name="startTime" value={selectedAvailability?.startTime || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora fin</Form.Label>
              <Form.Control name="finishTime" value={selectedAvailability?.finishTime || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duracion de los turnos</Form.Label>
              <Form.Control name="duration" value={selectedAvailability?.duration || ""} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
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
