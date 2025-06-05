/*import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Table, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import './GerenteDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GerenteDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [recaudacion, setRecaudacion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [resUsuarios, resReservas, resRecaudacion] = await Promise.all([
          fetch('https://localhost:7042/api/User/GetAllUsers', { headers }),
          fetch('https://localhost:7042/api/Booking/GetAllBookings', { headers }),
          fetch('https://localhost:7042/api/Caja/mes/recaudacion', { headers })
        ]);

        if (!resUsuarios.ok || !resReservas.ok || !resRecaudacion.ok) {
          throw new Error('Error al cargar datos del dashboard');
        }

        const usuariosData = await resUsuarios.json();
        const reservasData = await resReservas.json();
        const recaudacionData = await resRecaudacion.json();

        setUsuarios(usuariosData);
        setReservas(reservasData);
        setRecaudacion(recaudacionData.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usuariosActivos = usuarios.filter(u => u.cuotaActiva).length;

  const reservasPorDia = reservas.reduce((acc, reserva) => {
    const fecha = new Date(reserva.fechaHora).toLocaleDateString();
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(reservasPorDia),
    datasets: [
      {
        label: 'Reservas por día',
        data: Object.values(reservasPorDia),
        backgroundColor: '#36a2eb'
      }
    ]
  };

  if (loading) return <div className="dashboard-container"><Spinner animation="border" variant="light" /></div>;
  if (error) return <div className="dashboard-container"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="dashboard-container">
      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Total de Usuarios</div>
              <div className="dashboard-card-value">{usuarios.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Usuarios con Cuota Activa</div>
              <div className="dashboard-card-value">{usuariosActivos}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Recaudación del Mes</div>
              <div className="dashboard-card-value">${recaudacion.toLocaleString()}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">Uso de canchas por día</h5>
              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">Últimas reservas</h5>
              <Table className="table-dark-custom" hover responsive>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cancha</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.slice(-6).reverse().map(reserva => (
                    <tr key={reserva.id}>
                      <td>{new Date(reserva.fechaHora).toLocaleDateString()}</td>
                      <td>{new Date(reserva.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{reserva.cancha?.nombre || 'N/A'}</td>
                      <td>{reserva.usuario?.nombreCompleto || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GerenteDashboard;
*/
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './GerenteDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GerenteDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [recaudacion, setRecaudacion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      const fakeUsuarios = [
        { id: 1, nombre: 'Juan Pérez', cuotaActiva: true },
        { id: 2, nombre: 'Ana Gómez', cuotaActiva: true },
        { id: 3, nombre: 'Carlos López', cuotaActiva: false },
        { id: 4, nombre: 'Lucía Torres', cuotaActiva: true },
        { id: 5, nombre: 'Sofía Díaz', cuotaActiva: false }
      ];

      const fakeReservas = [
        {
          id: 101,
          fechaHora: '2025-06-04T20:00:00',
          cancha: { nombre: 'Cancha 1' },
          usuario: { id: 1, nombreCompleto: 'Juan Pérez' }
        },
        {
          id: 102,
          fechaHora: '2025-06-03T21:00:00',
          cancha: { nombre: 'Cancha 2' },
          usuario: { id: 2, nombreCompleto: 'Ana Gómez' }
        },
        {
          id: 103,
          fechaHora: '2025-05-15T21:30:00',
          cancha: { nombre: 'Cancha 2' },
          usuario: { id: 2, nombreCompleto: 'Ana Gómez' }
        },
        {
          id: 104,
          fechaHora: '2025-05-27T20:00:00',
          cancha: { nombre: 'Cancha 3' },
          usuario: { id: 3, nombreCompleto: 'Carlos López' }
        },
        {
          id: 105,
          fechaHora: '2025-04-10T20:00:00',
          cancha: { nombre: 'Cancha 1' },
          usuario: { id: 4, nombreCompleto: 'Lucía Torres' }
        }
      ];

      setUsuarios(fakeUsuarios);
      setReservas(fakeReservas);
      setRecaudacion(123456);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar reservas del mes seleccionado
  const reservasFiltradas = reservas.filter(r => {
    const f = new Date(r.fechaHora);
    return (
      f.getMonth() === fechaSeleccionada.getMonth() &&
      f.getFullYear() === fechaSeleccionada.getFullYear()
    );
  });

  const usuariosConReserva = [...new Set(reservasFiltradas.map(r => r.usuario.id))];
  const usuariosActivos = usuarios.filter(u => u.cuotaActiva && usuariosConReserva.includes(u.id)).length;

  const reservasAgrupadas = reservasFiltradas.reduce((acc, reserva) => {
    const fecha = new Date(reserva.fechaHora).toLocaleDateString();
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(reservasAgrupadas),
    datasets: [
      {
        label: `Reservas en ${fechaSeleccionada.toLocaleString('default', { month: 'long' })}`,
        data: Object.values(reservasAgrupadas),
        backgroundColor: "#242424",
      }
    ]
  };

  if (loading) return <div className="dashboard-container"><Spinner animation="border" variant="light" /></div>;

  return (
    <div className="dashboard-container">
      <Row className="mb-4">
        <Col md={3}>
          <Calendar
            value={fechaSeleccionada}
            onChange={setFechaSeleccionada}
            view="month"
            maxDetail="year"
            className="mb-3"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Usuarios con reservas</div>
              <div className="dashboard-card-value">{usuariosConReserva.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Usuarios con cuota activa</div>
              <div className="dashboard-card-value">{usuariosActivos}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-title">Recaudación estimada</div>
              <div className="dashboard-card-value">
                ${((recaudacion / reservas.length) * reservasFiltradas.length).toFixed(2)}
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

      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="mb-3">Reservas del mes</h5>
              <Table className="table-dark-custom" hover responsive>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cancha</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasFiltradas.map(r => (
                    <tr key={r.id}>
                      <td>{new Date(r.fechaHora).toLocaleDateString()}</td>
                      <td>{new Date(r.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{r.cancha?.nombre}</td>
                      <td>{r.usuario?.nombreCompleto}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GerenteDashboard;

