import React from "react";
import { Form, Button } from "react-bootstrap";
import "./registerCss/StepThree.css";

const StepThree = ({ formData, setFormData, onNext, onBack }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (
            !formData.name ||
            !formData.lastName ||
            !formData.birthdate ||
            !formData.locality ||
            !formData.nationality ||
            !formData.gender ||
            !formData.phoneNumber
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
        <div className="step-three-container">
            <div className="step-three-form-container">
                <h2 className="mb-4 text-center">Datos personales</h2>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="date"
                        name="birthdate"
                        placeholder="Fecha de nacimiento"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="locality"
                        placeholder="Localidad"
                        value={formData.locality}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="nationality"
                        placeholder="Nacionalidad"
                        value={formData.nationality}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Genero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        name="phoneNumber"
                        placeholder="N° de teléfono"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </Form.Group>

                
                <div className="d-flex justify-content-between gap-2">
                <Button variant="outline-secondary" className="button-back-custom" onClick={handleBack}>
                    ←
                </Button>

                <Button variant="primary" className="w-100" onClick={handleNext}>
                    Guardar
                </Button>
                </div>
            </div>
        </div>
    );
};

export default StepThree;
