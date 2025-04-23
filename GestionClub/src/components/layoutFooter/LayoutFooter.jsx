import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaChevronRight, FaClock } from 'react-icons/fa';
import './LayoutFooter.css'
const Footer = () => {
  return (
    <footer className="footer text-white py-5 w-100">
      <Container fluid>
        <Row>
          {/* Logo e info */}
          <Col md={4}>
            <img src="/logo.png" alt="Logo" className="mb-3" style={{ width: 100 }} />
            <p><FaMapMarkerAlt className="me-2" />ACA VA LA DIRECCION<br />Y ACA MAS INFO DE LA DIRECCION</p>
            <p><FaEnvelope className="me-2" />info@gestionclub.com</p>
            <p><FaPhone className="me-2" />telefono</p>
          </Col>

          {/* Enlaces */}
          <Col md={2}>
            <h5 className="text-success fw-bold">Gestion Club</h5>
            <ul className="list-unstyled">
              <li><FaChevronRight className="me-2" />El Club</li>
              <li><FaChevronRight className="me-2" />Servicios</li>
              <li><FaChevronRight className="me-2" />Actividades</li>
              <li><FaChevronRight className="me-2" />Calendario</li>
              <li><FaChevronRight className="me-2" />Contacto</li>
            </ul>
          </Col>



          {/* Horarios y redes */}
          <Col md={4}>
            <h5 className="text-success fw-bold">Horarios</h5>
            <p><FaClock className="me-2" />Laborables de 9:00 a 23:00 h.</p>
            <p><FaClock className="me-2" />Sábados, domingos y festivos de 8:30 a 22:00 h.</p>
            <p className="mt-4 fw-bold">SÍGUENOS EN REDES SOCIALES...</p>
            <div className="d-flex gap-3 fs-4 justify-content-center">
              <a href="#" className="text-white hover-icon"><FaFacebookF /></a>
              <a href="#" className="text-white hover-icon"><FaTwitter /></a>
              <a href="#" className="text-white hover-icon"><FaInstagram /></a>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row className="align-items-center">
            <p className="mb-0">Copyright © 2025. All rights reserved.</p>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;