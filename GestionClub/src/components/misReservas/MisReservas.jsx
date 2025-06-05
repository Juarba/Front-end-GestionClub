import React, { useEffect, useState } from "react";
import { Container, Table, Alert, Spinner } from "react-bootstrap";

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        console.log("Email del usuario logeado:", userEmail);

        fetch("https://localhost:7234/api/Booking/GetAllBookings")
        .then((res) => {
            if (!res.ok) throw new Error("Error al obtener reservas");
            return res.json();
        })
        .then((data) => {
            const filtradas = data.filter(
            (reserva) =>
                reserva.available === false && reserva.userEmail === userEmail
            );
            setReservas(filtradas);
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => setLoading(false));
    }, [userEmail]);

    return (
        <Container className="mt-5">
        <h3 className="mb-4">Mis Reservas</h3>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Día</th>
                <th>Horario</th>
                <th>Cancha</th>
            </tr>
            </thead>
            <tbody>
            {reservas.length === 0 ? (
                <tr>
                <td colSpan="3" className="text-center">
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
                    <td>{reserva.courtId}</td>
                </tr>
                ))
            )}
            </tbody>
        </Table>
        </Container>
    );
};

export default MisReservas;
