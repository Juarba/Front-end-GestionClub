import React from "react";
import { Button, Form } from "react-bootstrap";
import "./registerCss/StepTwo.css";

const StepTwo = ({ formData, setFormData, onNext, onBack }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (!formData.userName || 
            !formData.email
        ) {
            alert("Por favor completa todos los campos");
            return;
        }

        onNext();
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div className="step-two-container">
            <div className="step-two-form-container">
                <h2 className="mb-4 text-center">Datos de usuario</h2>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="userName"
                        placeholder="Nombre de usuario"
                        value={formData.userName}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="d-flex justify-content-between gap-2">
                <Button variant="outline-secondary" className="button-back-custom" onClick={handleBack}>
                    ←
                </Button>

                <Button variant="primary" className="w-100" onClick={handleNext}>
                    Siguiente
                </Button>
                </div>
            </div>
        </div>
    );
};

export default StepTwo;
