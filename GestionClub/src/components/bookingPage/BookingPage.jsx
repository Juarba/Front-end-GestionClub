import { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button, Card } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.css";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import BookingManagerModal from "../bookingModal/BookingModal";

const BookingPage = () => {
  const token = localStorage.getItem("jwtToken");
  const tokenDecoded = jwtDecode(token);
  //Extrae el rol desde el token
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
  const showButton = userRole === "Admin" || userRole === "Gerente";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://localhost:7234/api/Booking/GetAllBookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar reservas");
      }

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTurnos = availability
    .filter((turno) => dayjs(turno.startTime).isSame(selectedDate, "day"))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const allCourts = [...new Set(filteredTurnos.map((t) => t.courtId))].sort();
  const allHours = [
    ...new Set(filteredTurnos.map((t) => dayjs(t.startTime).format("HH:mm"))),
  ].sort();

  const turnosPorHoraYCancha = {};
  filteredTurnos.forEach((t) => {
    const hora = dayjs(t.startTime).format("HH:mm");
    if (!turnosPorHoraYCancha[hora]) turnosPorHoraYCancha[hora] = {};
    turnosPorHoraYCancha[hora][t.courtId] = t;
  });

  const handleSelectTurno = (turno) => {
    setSelectedTurno(turno);
    setIsCancelling(!turno.available); // Si está ocupado, es para cancelar
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const response = await fetch(
        `https://localhost:7234/api/User/AssignBooking/${selectedTurno.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al confirmar");

      alert("✅ ¡Reserva confirmada!");

      setAvailability((prev) =>
        prev.map((item) =>
          item.id === selectedTurno.id ? { ...item, available: false } : item
        )
      );

      setShowModal(false);
      setSelectedTurno(null);
    } catch (err) {
      alert("❌ No se pudo confirmar la reserva");
    }
  };

  const cancelBooking = async () => {
    try {
      const response = await fetch(
        `https://localhost:7234/api/User/CancelBooking/${selectedTurno.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // ⬅️ Lee el cuerpo del error
        throw new Error(errorData.error || "Error al cancelar");
      }

      alert("🗑️ ¡Reserva cancelada!");

      setAvailability((prev) =>
        prev.map((item) =>
          item.id === selectedTurno.id ? { ...item, available: true } : item
        )
      );

      setShowModal(false);
      setSelectedTurno(null);
    } catch (err) {
      alert(`${err.message}`);
    }
  };

  return (
    <Container className="booking-container">
      <h2 className="booking-title">Elige tu turno</h2>
      <Row>
        <Col md={5}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="calendar"
            tileClassName={({ date, view }) => {
              const isToday = dayjs(date).isSame(dayjs(), "day");
              const isWeekend = [0, 6].includes(date.getDay()); // 0: Sunday, 6: Saturday
              const isOtherMonth = date.getMonth() !== selectedDate.getMonth();

              return [
                isToday ? "today-tile" : "",
                isOtherMonth ? "tile-other-month" : "",
                isWeekend ? "tile-weekend" : "",
              ].join(" ");
            }}
          />

          {showButton && (
            <div className="mt-3 d-flex justify-content-start">
              <Button
                variant="success"
                onClick={() => setShowManagerModal(true)}
              >
                Crear reservas
              </Button>
            </div>
          )}
        </Col>

        <Col md={7}>
          {allHours.length === 0 ? (
            <p className="no-turnos">No hay turnos disponibles para este día</p>
          ) : (
            allHours.map((hora, idx) => (
              <Row key={idx} className="g-2 mb-2">
                {allCourts.map((courtId) => {
                  const turno = turnosPorHoraYCancha[hora]?.[courtId];
                  return (
                    <Col key={courtId}>
                      {turno ? (
                        <Card
                          className={`turno-card ${
                            !turno.available ? "disabled" : ""
                          }`}
                          onClick={() => handleSelectTurno(turno)}
                        >
                          <Card.Body>
                            <Card.Title className="turno-hora">
                              {dayjs(turno.startTime).format("HH:mm")} -{" "}
                              {dayjs(turno.finishTime).format("HH:mm")}
                            </Card.Title>
                            <Card.Text>
                              Cancha {turno.courtId} <br />
                              Estado:{" "}
                              <strong>
                                {turno.available ? "Disponible" : "Ocupado"}
                              </strong>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ) : (
                        <Card className="turno-card disabled">
                          <Card.Body>
                            <Card.Title className="turno-hora">
                              {hora}
                            </Card.Title>
                            <Card.Text>
                              Cancha {courtId} <br />
                              <strong>Sin turno</strong>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      )}
                    </Col>
                  );
                })}
              </Row>
            ))
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isCancelling ? "Cancelar Reserva" : "Confirmar Reserva"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isCancelling ? (
            <>
              ¿Deseás <strong>cancelar</strong> la reserva de la cancha{" "}
              {selectedTurno?.courtId} de{" "}
              {dayjs(selectedTurno?.startTime).format("HH:mm")} a{" "}
              {dayjs(selectedTurno?.finishTime).format("HH:mm")}?
            </>
          ) : (
            <>
              ¿Deseás <strong>reservar</strong> la cancha{" "}
              {selectedTurno?.courtId} de{" "}
              {dayjs(selectedTurno?.startTime).format("HH:mm")} a{" "}
              {dayjs(selectedTurno?.finishTime).format("HH:mm")}?
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={isCancelling ? cancelBooking : confirmBooking}
          >
            {isCancelling ? "Cancelar Reserva" : "Confirmar"}
          </Button>
        </Modal.Footer>
      </Modal>
      <BookingManagerModal
        show={showManagerModal}
        onFetch={fetchData}
        onClose={() => setShowManagerModal(false)}
      />
    </Container>
  );
};

export default BookingPage;
