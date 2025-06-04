import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Calendar as Cal, dayjsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './BookingPage.css';
import dayjs from "dayjs";
import { jwtDecode } from 'jwt-decode';

const BookingPage = () => {
  const navigate = useNavigate();
  const localizer = dayjsLocalizer(dayjs);

  const token = localStorage.getItem("jwtToken");
  const tokenDecoded = jwtDecode(token);

  const [bookingsList, setBookingList] = useState([]);
  const [availabilityList, setAvailabilityList] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingListMapped, setBookingListMapped] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await fetch("https://localhost:7234/api/Booking/GetAllBookings", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setBookingList(data);

        setBookingListMapped(
          data.map(booking => ({
            id: booking.id,
            title: `${booking.available ? "Disponible" : "Ocupado"}`,
            start: new Date(booking.startTime),
            end: new Date(booking.finishTime),
            resource: {
              court: booking.courtId,
              available: booking.available,
            }
          }))
        );
      } catch (error) {
        console.log(error);
      }

      try {
        const response = await fetch("https://localhost:7234/api/Availability/GetAll", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error();
        const data = await response.json();
        setAvailabilityList(data);

      } catch (error) {
        console.log(error);
      }
    };

    getAllData();
  }, []);

  const handleDateNavigate = (newDate) => {
    const minDate = new Date(bookingsList[0].startTime);
    const maxDate = new Date(bookingsList[bookingsList.length - 1].finishTime);

    if (newDate < minDate) setCurrentDate(minDate);
    else if (newDate > maxDate) setCurrentDate(maxDate);
    else setCurrentDate(newDate);
  };

  const getEventStyle = (event) => {
    const backgroundColor = event.resource?.available ? '#4caf50' : '#f44336';
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        border: "solid 5px",
        maxHeight: "100px"
      }
    };
  };

  const onSelectEvent = (event) => {
    if (event.resource.available) {
      setSelectedBooking(event);
      setShowModal(true);
    }
  };

  const confirmBooking = async () => {
  try {
    
const response = await fetch(`https://localhost:7234/api/User/AssignBooking/${selectedBooking.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al confirmar la reserva");

    alert("✅ ¡Reserva confirmada!");

    setBookingListMapped(prev =>
      prev.map(b =>
        b.id === selectedBooking.id
          ? { ...b, title: "Ocupado", resource: { ...b.resource, available: false } }
          : b
      )
    );

    setShowModal(false);
    setSelectedBooking(null);
  } catch (err) {
    alert("❌ No se pudo confirmar la reserva. Verifica tu sesión o intenta nuevamente.");
    console.error("Error:", err);
  }
};


  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.resource.available ? "Disponible" : "Ocupado"}</strong><br />
      <span>Cancha {event.resource.court}</span>
    </div>
  );

  return (
    <Container className="booking-container flex">
      {/* <Col md={4} className="info-col mt-3">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><Info size={40} className="me-1" />Información</Card.Title>
              <hr />
              <p><User size={25} className="m-2" /><strong>Socio</strong><br />Nombre y Apellido</p>
              <p><Mail size={25} className="m-2" /><strong>Email</strong><br />Ej@gmail.com</p>
              <p><Phone size={25} className="m-2" /><strong>Tel</strong><br />+123 45678910</p>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><Calendar size={40} className="me-3" />Fecha</Card.Title>
              <Form.Control className='mt-4  w-100' type="date" />
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><Users size={40} className="me-2" />Cantidad de Jugadores</Card.Title>
              <Form.Select className='mt-4  w-100'>
                <option>Seleccionar</option>
                <option>2</option>
                <option>4</option>
              </Form.Select>
            </Card.Body>
          </Card>
          <Card className="info-box">
            <Card.Body>
              <Card.Title><BadgeAlert size={40} className="me-3" />Atencion:</Card.Title>
              <p className="medium mt-3 mb-0">En caso etc etc</p>
            </Card.Body>
          </Card>
        </Col> */}

      <h2 className="booking-title">Reserva tu cancha</h2>
      <Row>
        <Col md={12} className="mt-3">
          <Card>
            <Card.Body>
              <Cal
                localizer={localizer}
                view={currentView}
                onView={view => setCurrentView(view)}
                views={['month', 'day']}
                date={currentDate}
                onNavigate={handleDateNavigate}
                events={bookingListMapped}
                onSelectEvent={onSelectEvent}
                eventPropGetter={getEventStyle}
                step={30}
                timeslots={1}
                components={{ event: CustomEvent }}
                style={{ height: "100vh", width: "auto" }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseás reservar la cancha {selectedBooking?.resource.court} de {dayjs(selectedBooking?.start).format("HH:mm")} a {dayjs(selectedBooking?.end).format("HH:mm")}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={confirmBooking}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingPage;