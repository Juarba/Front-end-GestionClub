import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Calendar, User, Users, Mail, Phone, Info, BadgeAlert } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import {Calendar as Cal,  dayjsLocalizer, Views} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './BookingPage.css';
import dayjs from "dayjs";


const schedule = ['08:00', '9:30', '11:00', '12:30', 'etc'];
const courts = ['Cancha 1', 'Cancha 2', 'Cancha 3', 'Cancha 4'];

const BookingPage = () => {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate("/bookingOrder");
  };

  const localizer = dayjsLocalizer(dayjs);

  const token = localStorage.getItem("jwtToken");
  const tokenDecoded = jwtDecode(token);
  const [bookingsList, setBookingList] = useState([]);
  const [availabilityList, setAvailabilityList] = useState([]);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  
  const handleDateNavigate = (newDate) => {
    const minDate = new Date(bookingsList[0].startTime);
    const maxDate = new Date(bookingsList[bookingsList.length - 1].finishTime);

    if (newDate < minDate) {
      setCurrentDate(minDate);
    } else if (newDate > maxDate) {
      setCurrentDate(maxDate);
    } else {
      setCurrentDate(newDate);
    }

  }
  
  useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await fetch("https://localhost:7234/api/Booking/GetAllBookings", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })

        if (!response.ok) {
          throw new Error()
        }

        const data = await response.json();
        setBookingList(data);
      }

      catch (error) {
        console.log(error)
      }

      try {
        const response = await fetch("https://localhost:7234/api/Availability/GetAll", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })

        if (!response.ok) {
          throw new Error()
        }

        const data = await response.json();
        setAvailabilityList(data);
      
      } catch (error) {
        console.log(error)
      }
    }
    getAllData();
  }, [])

  
  console.log("avalabilitiList:",availabilityList);
  console.log("bookingsList:",bookingsList);
  return (
    <Container className="booking-container flex">
      <h6 className="booking-title">Reservas</h6>
      <Row >
        <Col md={4} className="info-col mt-3">
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
        </Col>

        <Col md={8} className="mt-3">
          <Card>
            <Card.Body>
              <Cal 
                localizer={localizer}
                view ={currentView}
                onView={(view) => setCurrentView(view)}
                views={['month', 'week', 'day']}
                date={currentDate}
                onNavigate={handleDateNavigate}
                style={{
                height: "80vh",
                width: "100%",
              }}/>


              {/* <h5>Reservas</h5>
              <table className="table table-bordered text-center booking-table mt-3">
                <thead>
                  <tr>
                    {courts.map((court, id) => (
                      <th key={id}>{court}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((time, id) => (
                    <tr key={id}>
                      <td>{time}</td>
                      <td>Libre</td>
                      <td>Ocupado</td>
                      <td>Horario de clase</td>
                      <td>etc</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-end gap-4 mt-3">
                <Button variant="outline-dark" className="rounded-pill px-3 ">
                  Cancelar
                </Button>
                <Button onClick={handleOrder} variant="dark" className="rounded-pill px-4">
                  Siguiente
                </Button>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BookingPage;

