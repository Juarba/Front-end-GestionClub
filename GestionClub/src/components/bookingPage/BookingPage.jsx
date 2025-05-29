import { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Calendar, User, Users, Mail, Phone, Info, BadgeAlert } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import {Calendar as Cal,  dayjsLocalizer, Views} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './BookingPage.css';
import dayjs from "dayjs";

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
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openingTime, setOpeningTime] = useState(new Date());
  const [closingTime, setClosingTime] = useState(new Date());
  const [bookingListMapped, setBookingListMapped] = useState([]);
    
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

        setBookingListMapped(
         data.map(booking => ({
          title: `${booking.available ? "Disponible" : "Ocupado"}`, 
          start: new Date(booking.startTime),
          end: new Date(booking.finishTime),
          resource: {
            court: booking.court.id,
            available: booking.available,
          }
         })) 
        )
        console.log(bookingListMapped)
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

  const getEventStyle = (event) => {
    const backgroundColor = event.resource?.available ? '#4caf50' : '#f44336'; //4caf50 = verde | f44336 = rojo
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        border: "solid 5px ",
        maxHeight:"100px"
      }
    };
  };

  const onSelectEvent = () => {
    console.log("hola")
    return {
      style: {
        backgroundColor:"#f44336"
      }
    }
  }

  const CustomEvent = ({ event }) => (
  <div style={{}}>
    <strong>{event.resource.available ? "Disponible" : "Ocupado" }</strong><br />
    <span>Cancha {event.resource.court}</span>
  </div>
  );
  
  //console.log("avalabilitiList:",availabilityList);
  console.log("bookingsList:",bookingsList);
  return (
    <Container className="booking-container flex">
      <h2 className="booking-title">Reserva tu cancha</h2>
      <Row className=''>
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

        <Col md={12} className="mt-3">
          <Card>
            <Card.Body>
              <Cal 
                localizer={localizer}
                view ={currentView}
                onView={(view) => setCurrentView(view)}
                views={['month', 'day']}
                date={currentDate}
                onNavigate={handleDateNavigate} 
                events={bookingListMapped} //mapeo de bookings
                onSelectEvent={onSelectEvent} //este evento se ejecutara cuando se hace click en un booking
                eventPropGetter={getEventStyle} 
                step={30}
                timeslots={1}
                components={{
                  event: CustomEvent
                }}
                style={{
                height: "100vh",
                width: "auto",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BookingPage;