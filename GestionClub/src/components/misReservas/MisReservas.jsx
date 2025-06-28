import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Alert,
  Spinner,
  Button,
  Modal,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import "./MisReservas.css";
import dayjs from "dayjs";
import emailjs from "@emailjs/browser";
import "dayjs/locale/es";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [showModal, setShowModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch("https://localhost:7234/api/Booking/GetAllBookings")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener reservas");
        return res.json();
      })
      .then((data) => {
        const ahora = dayjs();
        const filtradas = data.filter(
          (reserva) =>
            reserva.available === false &&
            reserva.userEmail === email &&
            dayjs(reserva.startTime).isAfter(ahora)
        );
        setReservas(filtradas);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const cancelBooking = async (reserva) => {
    const token = localStorage.getItem("jwtToken");

    try {
      setIsLoading(true);
      const userResponse = await fetch(
        "https://localhost:7234/api/User/GetCurrentUser",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Error al obtener el usuario actual");
      }

      const currentUser = await userResponse.json();
      console.log("Usuario actual:", currentUser);

      const response = await fetch(
        `https://localhost:7234/api/User/CancelBooking/${reserva.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cancelar");
      }

      setToastMessage("Reserva cancelada con exito");
      setToastVariant("success");
      setShowToast(true);

      setShowModal(false);
      setReservas((prev) => prev.filter((r) => r.id !== reserva.id));

      try {
        const fecha = dayjs(selectedTurno.startTime).locale("es").format("dddd D [de] MMMM ");
        const horaInicio = dayjs(selectedTurno.startTime).format("HH:mm");
        const horaFin = dayjs(selectedTurno.finishTime).format("HH:mm");
        const fechaFormateada =
          fecha.charAt(0).toUpperCase() +
          fecha.slice(1) +
          ` de ${horaInicio} a ${horaFin} hs`;

        await emailjs.send(
          "service_nc27tnn",
          "template_yo7oa0z",
          {
            userName: currentUser.name,
            userEmail: currentUser.email,
            startTime: fechaFormateada,
            courtId: selectedTurno.courtId,
          },
          "TTFwAlFzVFhKF3oL-"
        );
      } catch (mailError) {
        console.error("Error al enviar el email de cancelación:", mailError);
      }
    } catch (err) {
      setToastMessage(err.message);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (reserva) => {
    setSelectedTurno(reserva);
    setShowModal(true);
  };

  return (
    <Container className="misreservas-container">
      <h3 className="misreservas-title">Mis Reservas</h3>

      {loading && (
        <div className="spinner-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table className="table-reservas" responsive>
        <thead>
          <tr>
            <th>Día</th>
            <th>Horario</th>
            <th>Cancha</th>
            <th>Arrepentimiento</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay reservas asignadas.
              </td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{new Date(reserva.startTime).toLocaleDateString()}</td>
                <td>
                  {new Date(reserva.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(reserva.finishTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>Cancha {reserva.courtId}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleShowModal(reserva)}
                  >
                    <i className="bi bi-trash" /> Cancelar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseás <strong>cancelar</strong> la reserva de la cancha{" "}
          {selectedTurno?.courtId} del día{" "}
          {dayjs(selectedTurno?.startTime).format("DD/MM/YYYY")} de{" "}
          {dayjs(selectedTurno?.startTime).format("HH:mm")} a{" "}
          {dayjs(selectedTurno?.finishTime).format("HH:mm")}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const reserva = selectedTurno;
              cancelBooking(reserva);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Cancelando...
              </>
            ) : (
              "Cancelar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          bg={toastVariant}
          autohide
          delay={3000}
          onClose={() => setShowToast(false)}
        >
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MisReservas;
