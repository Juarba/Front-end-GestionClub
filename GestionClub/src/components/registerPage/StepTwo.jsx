import React from "react";
import { Button, Form } from "react-bootstrap";
import "./registerCss/StepTwo.css";

const StepTwo = ({ formData, setFormData, onNext }) => {
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

    return (
        <div className="step-two-container d-flex justify-content-center">
            <div className="form-box p-4 rounded shadow-sm bg-white" style={{ maxWidth: "500px", width: "100%" }}>
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

                <Button variant="primary" className="w-100" onClick={handleNext}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default StepTwo;
