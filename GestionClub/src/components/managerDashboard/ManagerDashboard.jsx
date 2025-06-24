import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ManagerDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ManagerDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [recaudacion, setRecaudacion] = useState(0);
  const [activos, setActivos] = useState([]);
  const [horariosPopulares, setHorariosPopulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [paginaActual, setPaginaActual] = useState(1);
  const [cantidadReservasMes, setCantidadReservasMes] = useState(0);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const porPagina = 10;

  const fetchCantidadReservasMes = async (fecha) => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    try {
      const response = await fetch(
        `https://localhost:7234/api/Booking/GetBookingCountByMonth?month=${month}&year=${year}`,
        { headers }
      );

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(
          error?.detail || "Error desconocido al obtener reservas."
        );
        setShowErrorToast(true);
        setCantidadReservasMes(0);
        return;
      }

      const data = await response.json();

      if (typeof data === "number") {
        setCantidadReservasMes(data);
      } else {
        setErrorMessage("La respuesta del servidor no es válida.");
        setShowErrorToast(true);
        setCantidadReservasMes(0);
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor.");
      setShowErrorToast(true);
      setCantidadReservasMes(0);
    }
  };

  const fetchRecaudacion = async (fecha) => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    try {
      const response = await fetch(
        `https://localhost:7234/api/Payment/GetMonthlyRevenue?month=${month}&year=${year}`,
        { headers }
      );
      const data = await response.json();
      setRecaudacion(data);
    } catch (error) {
      console.error("Error al obtener recaudación:", error);
      setRecaudacion(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [resUsuarios, resReservas, resActivos, resHorarios] =
          await Promise.all([
            fetch("https://localhost:7234/api/User/GetAllUsers", { headers }),
            fetch("https://localhost:7234/api/Booking/GetAllBookings", {
              headers,
            }),
            fetch("https://localhost:7234/api/User/GetActivesUsers", {
              headers,
            }),
            fetch(
              "https://localhost:7234/api/Booking/GetMostFrequentBookingHours",
              { headers }
            ),
          ]);

        setUsuarios(await resUsuarios.json());
        const reservasData = await resReservas.json();
        setReservas(reservasData);
        setActivos(await resActivos.json());
        setHorariosPopulares(await resHorarios.json());

        fetchRecaudacion(fechaSeleccionada);
        fetchCantidadReservasMes(fechaSeleccionada);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchRecaudacion(fechaSeleccionada),
      fetchCantidadReservasMes(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const reservasFiltradas = reservas.filter((r) => {
    const fecha = new Date(r.startTime);
    return (
      r.available === false &&
      fecha.getMonth() === fechaSeleccionada.getMonth() &&
      fecha.getFullYear() === fechaSeleccionada.getFullYear()
    );
  });

  const usuariosConReserva = [
    ...new Set(reservasFiltradas.map((r) => r.usuario?.id)),
  ];

  const year = fechaSeleccionada.getFullYear();
  const month = fechaSeleccionada.getMonth();
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const diasDelMes = Array.from({ length: diasEnMes }, (_, i) => {
    const dia = (i + 1).toString().padStart(2, "0");
    const mes = (month + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
  });

  const reservasAgrupadas = reservasFiltradas.reduce((acc, reserva) => {
    const fechaObj = new Date(reserva.startTime);
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const label = `${dia}/${mes}`;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const dataPorDia = diasDelMes.map((dia) => reservasAgrupadas[dia] || 0);

  const chartData = {
    labels: diasDelMes,
    datasets: [
      {
        label: `Reservas por día en ${fechaSeleccionada.toLocaleString(
          "es-AR",
          { month: "long" }
        )}`,
        data: dataPorDia,
        backgroundColor: "rgba(76, 175, 80, 0.9)",
      },
    ],
  };

  const todasLasHoras = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, "0") + ":00"
  );
  const agrupadasPorHora = horariosPopulares.reduce((acc, h) => {
    const horaLabel = h.hour.toString().padStart(2, "0") + ":00";
    acc[horaLabel] = h.count;
    return acc;
  }, {});
  const dataPorHora = todasLasHoras.map((hora) => agrupadasPorHora[hora] || 0);

  const horariosChartData = {
    labels: todasLasHoras,
    datasets: [
      {
        label: "Reservas por hora",
        data: dataPorHora,
        backgroundColor: "rgba(75, 192, 192, 0.88)",
      },
    ],
  };

  const horariosChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} reservas`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const totalPaginas = Math.ceil(reservasFiltradas.length / porPagina);
  const reservasPaginadas = reservasFiltradas.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Row>
        <Col lg={3}>
          <div className="calendar-wrapper text-center">
            <h5 className="mb-3">Seleccionar mes</h5>
            <Calendar
              className="calendar"
              value={fechaSeleccionada}
              onChange={setFechaSeleccionada}
              view="month"
              maxDetail="year"
              locale="es"
            />
          </div>
        </Col>

        <Col lg={9}>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="dashboard-card-title">
                    Cantidad de reservas
                  </div>
                  <div className="dashboard-card-value">
                    {cantidadReservasMes}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="dashboard-card-title">Usuarios activos</div>
                  <div className="dashboard-card-value">{activos.length}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="dashboard-card-title">
                    Recaudación de cuotas
                  </div>
                  <div className="dashboard-card-value">
                    ${recaudacion ? recaudacion.toLocaleString() : "0"}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="dashboard-card">
                <Card.Body>
                  <h5 className="mb-3">Gráfico de reservas por día</h5>
                  <Bar data={chartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="dashboard-card">
                <Card.Body>
                  <h5 className="mb-3">Horarios más reservados</h5>
                  <Bar
                    data={horariosChartData}
                    options={horariosChartOptions}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="dashboard-card">
                <Card.Body>
                  <h5 className="mb-3">Reservas del mes</h5>
                  <Table
                    className="table-dashboard"
                    hover
                    responsive
                    bsPrefix="custom-table"
                  >
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Cancha</th>
                        <th>Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservasPaginadas.map((r) => (
                        <tr key={r.id}>
                          <td>{new Date(r.startTime).toLocaleDateString()}</td>
                          <td>
                            {new Date(r.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>Cancha {r.courtId}</td>
                          <td>{r.userName ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="success"
                      onClick={() =>
                        setPaginaActual((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={paginaActual === 1}
                    >
                      Anterior
                    </Button>
                    <span>
                      Página {paginaActual} de {totalPaginas}
                    </span>
                    <Button
                      variant="success"
                      onClick={() =>
                        setPaginaActual((prev) =>
                          Math.min(prev + 1, totalPaginas)
                        )
                      }
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ position: "fixed", top: 20, right: 20, zIndex: 1060 }}
      >
        <Toast
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          bg="danger"
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ManagerDashboard;
