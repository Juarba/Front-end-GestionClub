import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Toast,
    ToastContainer,
    Spinner,
    Form,
} from "react-bootstrap";

import './BookingModal.css';

const BookingManagerModal = ({ show, onClose, onFetch }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showToast, setShowToast] = useState(false);
    

    const token = localStorage.getItem("jwtToken");

    const handleCreateBookings = async () => {
        if (!startDate || !endDate) {
            showToastMsg("Debes seleccionar ambas fechas", "danger");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("https://localhost:7234/api/Booking/CreateBooking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    startTime: startDate,
                    finishTime: endDate,
                }),
            });

            if (!res.ok) {
                const errorText = await res.json();
                throw new Error(errorText.detail || "Error al crear reservas");
            }

            showToastMsg("Reservas creadas exitosamente", "success");
            setStartDate("");
            setEndDate("");
            onClose();
            onFetch();
        } catch (err) {
            console.error(err);
            showToastMsg(err.message, "danger");
        } finally {
            setIsLoading(false);
        }
    };

    const showToastMsg = (msg, variant = "success") => {
        setToastMessage(msg);
        setToastVariant(variant);
        setShowToast(true);
    };

    useEffect(() => {
        if (!show) {
            setStartDate("");
            setEndDate("");
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Gestión de reservas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCreateBookings} disabled={isLoading}>
                        Crear reservas
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === "success" ? "Éxito" : "Error"}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default BookingManagerModal;
