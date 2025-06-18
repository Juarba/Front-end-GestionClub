import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { GiTennisBall } from "react-icons/gi";
import "./BookingOrder.css";
import { useNavigate } from "react-router-dom";

const BookingOrder = () => {
    const itemsEjemplo = [
        {
            id: 1,
            courtNumber: "Cancha 2",
            players: 4,
            price: 400,
            time: "15:00",
            day: "29/5",
        },
        {
            id: 2,
            courtNumber: "Cancha 4",
            players: 2,
            price: 300,
            time: "16:00",
            day: "27/6",
        },
        {
            id: 3,
            courtNumber: "Cancha 3",
            players: 2,
            price: 350,
            time: "14:00",
            day: "30/7",
        },
    ];

    const subtotal = itemsEjemplo.reduce((acc, item) => acc + item.price, 0);

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate("/booking");
    };

    return (
        <Container flex className="order-container">
            <h6 className="order-title">Orden de reserva</h6>
            {/* <h6 className="order-title">Orden #0123456789</h6> */}
            <Row>
                <Col md={7} className="mt-3">
                    {itemsEjemplo.map((item) => (
                        <Card className="mb-4 order-card p-3" key={item.id}>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div className="d-flex  align-items-center">
                                    <div className="order-icon">
                                        <GiTennisBall className="icon ball" />
                                    </div>
                                    <div className="me-2">
                                        <Card.Title className="mb-2"><strong>{item.courtNumber}</strong></Card.Title>
                                        <Card.Text className="mb-2">Cant. jugadores: {item.players}</Card.Text>
                                        <Card.Text className="mb-2 fw-bold fs-4">${item.price.toFixed(2)}</Card.Text>
                                        <Card.Text className="mb-2"> Dia: {item.day} </Card.Text>
                                        <Card.Text className="mb-2"> {item.time} hs.</Card.Text>
                                    </div>
                                </div>
                                <div className="ms-1 mt-auto">
                                    <Button variant="danger">
                                        <FaTrashAlt className="me-1" />
                                        Eliminar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                <Col md={5} className="mt-3">
                    <Card>
                        <Card.Body className="p-4">
                            <Card.Title className="border-bottom pb-3 mb-4">Resumen</Card.Title>
                            <div className="d-flex justify-content-between align-items-baseline mb-4 ">
                                <span  >Total</span>
                                <span className="fw-bold fs-4 ms-2">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-center gap-4">
                                <Button onClick={handleCancel} variant="outline-dark" className="rounded-pill px-3 ">
                                    Cancelar
                                </Button>
                                <Button variant="success" className="rounded-pill px-4">
                                    Pagar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingOrder;
