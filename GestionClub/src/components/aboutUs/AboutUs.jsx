import React, { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import "./AboutUs.css";

const AboutUs = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    reason: "",
    user_email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitted(false);
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm("service_s2q1y9g", "template_m8z7d98", form.current, {
        publicKey: "iJr3FGss8mPjEtx2E",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setSubmitted(true);
          setFormData({
            user_name: "",
            reason: "",
            user_email: "",
            message: "",
          });
          setIsSending(false);
        },
        (error) => {
          console.log("FAILED...", error.text);
          setIsSending(false);
        }
      );
  };

  return (
    <Container className="mt-5 container-bg mb-5">
      <Row className="justify-content-center align-items-center">
        <Col md={8}>
          <div className="contact-container">
            <h2 className="contact-title">Contacto</h2>
            <p className="contact-description">
              ¿Tenés alguna consulta o comentario? ¡Escribinos!
            </p>

            {submitted && (
              <Alert variant="success">¡Gracias por tu mensaje!</Alert>
            )}

            <Form ref={form} onSubmit={sendEmail} className="contact-form">
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Ingresa su nombre"
                  className="custom-placeholder"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formReason">
                <Form.Label>Motivo</Form.Label>
                <Form.Control
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Ejemplo: 'No me deja alquilar una cancha' "
                  className="custom-placeholder"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  placeholder="Ingrese su correo electronico"
                  className="custom-placeholder"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Consulta</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ingrese su consulta..."
                  className="custom-placeholder"
                  required
                />
              </Form.Group>

              <Button variant="dark" type="submit" disabled={isSending}>
                {isSending ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
