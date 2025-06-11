import React, { useEffect, useState } from "react";
import { Container, Table, Alert, Spinner } from "react-bootstrap";
import "./MisReservas.css";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch("https://localhost:7234/api/Booking/GetAllBookings")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener reservas");
        return res.json();
      })
      .then((data) => {
        const filtradas = data.filter(
          (reserva) =>
            reserva.available === false && reserva.userEmail === email
        );
        setReservas(filtradas);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userEmail]);

  return (
    <Container className="misreservas-container">
      <h3 className="misreservas-title">Mis Reservas</h3>

      {loading && <div className="spinner-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table className="table-reservas" responsive>
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
                <td>Cancha {reserva.courtId}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MisReservas;
