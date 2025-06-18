import { useEffect, useState } from "react";
import { Modal, Button, Toast, ToastContainer, Spinner } from "react-bootstrap";
import './CourtManagerModal.css';

const CourtManagerModal = ({ show, onClose }) => {
    const [courts, setCourts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showToast, setShowToast] = useState(false);

    const token = localStorage.getItem("jwtToken");

    const fetchCourts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("https://localhost:7234/api/Court", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setCourts(data);
        } catch (err) {
            console.error(err);
            showToastMsg("Error al cargar canchas", "danger");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCourt = async (courtId) => {
        try {
            const res = await fetch(`https://localhost:7234/api/Court/${courtId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar cancha");
            showToastMsg("Cancha eliminada correctamente", "success");
            fetchCourts();
        } catch (err) {
            showToastMsg("No se pudo eliminar la cancha", "danger");
        }
    };

    const handleCreateCourt = async () => {
        try {
            const res = await fetch("https://localhost:7234/api/Court", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al crear cancha");
            showToastMsg("Cancha creada correctamente", "success");
            fetchCourts();
        } catch (err) {
            showToastMsg("No se pudo crear la cancha", "danger");
        }
    };

    const showToastMsg = (msg, variant = "success") => {
        setToastMessage(msg);
        setToastVariant(variant);
        setShowToast(true);
    };

    useEffect(() => {
        if (show) {
            fetchCourts();
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Gestión de canchas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : courts.length === 0 ? (
                        <p>No hay canchas registradas.</p>
                    ) : (
                        <ul className="list-group">
                            {courts.map((court) => (
                                <li
                                    key={court.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    Cancha {court.id}
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteCourt(court.id)}
                                    >
                                        <i className="bi bi-trash" /> Eliminar
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCreateCourt}>
                        Crear nueva cancha
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

export default CourtManagerModal;
