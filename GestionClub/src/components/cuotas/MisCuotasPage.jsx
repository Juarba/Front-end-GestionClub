import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MisCuotasPage = () => {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePagar = (cuota) => {
    const titulo = `Cuota ${cuota.month}/${cuota.year}`;
    const precio = cuota.price;
    const cantidad = 1;
    const cuotaId = cuota.monthlyFeeId; 
    const userId = cuota.userId;

    navigate("/pago", {
      state: { titulo, precio, cantidad, cuotaId: cuota.monthlyFeeId, userId: userId },
    });
  };

  useEffect(() => {
    const fetchCuotas = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(
          "https://localhost:7234/api/Payment/GetByCurrentUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las cuotas.");
        }

        const data = await response.json();
        setCuotas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCuotas();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h3 className="mb-4">Mis Cuotas</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Año</th>
            <th>Precio</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {cuotas.length > 0 ? (
            cuotas.map((cuota) => (
              <tr key={cuota.id}>
                <td>{cuota.month}</td>
                <td>{cuota.year}</td>
                <td>${cuota.price.toFixed(2)}</td>
                <td>{new Date(cuota.dueDate).toLocaleDateString()}</td>
                <td>{cuota.paid ? "Pagado" : "Pendiente"}</td>
                <td>
                  {!cuota.paid ? (
                    <Button
                      variant="success"
                      onClick={() => handlePagar(cuota)}
                    >
                      Pagar
                    </Button>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay cuotas asignadas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MisCuotasPage;
