import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./registerCss/StepConfirm.css";

const StepConfirm = () => {
    const navigate = useNavigate();

    const handleAccess = () => {
        navigate("/");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="text-center p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                <Card.Body>
                    <Card.Title>¡Bienvenido!</Card.Title>
                    <Card.Text>Ya puedes acceder a tu cuenta</Card.Text>
                    <Button variant="primary" onClick={handleAccess}>
                        Acceder
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StepConfirm;
