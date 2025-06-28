import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./registerCss/StepOne.css";

const StepOne = ({ formData, setFormData, onNext }) => {
  const navigate = useNavigate();
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "email") {
      setEmailExists(false);
    }
  };

  const handleNext = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword ||
      !formData.phoneNumber
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7234/api/User/CreateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.name,
            Email: formData.email,
            Password: formData.password,
            PhoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (
          errorData.detail &&
          errorData.message.toLowerCase().includes("ya existe")
        ) {
          setEmailExists(true);
        } else {
          alert(`Error: ${errorData.message}`);
        }

        return;
      }

      onNext();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Ocurrió un error al intentar registrar al usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="step-one-container">
      <div className="step-one-form-container">
        <h2 className="mb-4 text-center">Crear cuenta</h2>

        <div className="register-toggle">
          <Button
            variant="success"
            onClick={handleToLogin}
            className="register-toggle-button text-white"
          >
            Iniciar Sesión
          </Button>
          <Button variant="dark" className="register-toggle-button">
            Registrarme
          </Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className='custom-placeholder'
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            isInvalid={emailExists}
            className='custom-placeholder'
          />
          {emailExists && (
            <Form.Text className="text-danger">
              Ya existe un usuario con ese correo electrónico
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className='custom-placeholder'
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="password"
            name="repeatPassword"
            placeholder="Repetir contraseña"
            value={formData.repeatPassword}
            onChange={handleChange}
            className='custom-placeholder'
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="N° de teléfono"
            value={formData.phoneNumber}
            maxLength={10}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, phoneNumber: onlyNums });
            }}
            className='custom-placeholder'
          />
        </Form.Group>

        <Button variant="dark" type="submit" className="w-100 mb-3" onClick={handleNext} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              {' '}Cargando...
            </>
          ) : (
            'Registrarme'
          )}
        </Button>

        <div className="login-prompt">
          <small>
            ¿Ya tienes una cuenta?{" "}
            <a href="#" onClick={handleToLogin}>
              Iniciar sesión
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
