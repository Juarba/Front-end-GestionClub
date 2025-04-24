import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./registerCss/StepOne.css";

const StepOne = ({ formData, setFormData, onNext }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (
            !formData.dni ||
            !formData.email ||
            !formData.password ||
            !formData.repeatPassword
        ) {
            alert("Por favor completa todos los campos");
            return;
        }

        if (formData.password !== formData.repeatPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        onNext();
    };

    const handleToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="step-one-container">
            <div className="form-box p-4 rounded shadow-sm bg-white">
                <h2 className="mb-4 text-center">Crear cuenta</h2>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="dni"
                        placeholder="N° de documento"
                        value={formData.dni}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        type="password"
                        name="repeatPassword"
                        placeholder="Repetir contraseña"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" className="w-100 mb-3" onClick={handleNext}>
                    Registrarme
                </Button>

                <div className="login-prompt">
                    <small>
                        ¿Ya tienes una cuenta? 
                        <Link to="/login" className="btn btn-link p-0 align-baseline">Inciar sesion</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default StepOne;
