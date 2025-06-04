import { useEffect, useState } from "react";
import {
    Button,
    Container,
    Form,
    Modal,
    Table,
    Alert,
    ToastContainer,
    Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MonthlyFee = () => {
    const [monthlyFees, setMonthlyFees] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showToast, setShowToast] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFeeId, setSelectedFeeId] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        fetchMonthlyFees();
    }, []);

    const fetchMonthlyFees = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch("https://localhost:7234/api/MonthlyFee", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setMonthlyFees(data);
        } catch (error) {
            console.error("Error fetching monthly fees:", error);
            setErrorMsg("Hubo un error al cargar las cuotas.");
        }
    };

    const handleCreateFee = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!price || !month || !year) {
            setToastMessage("Por favor, complete todos los campos.");
            setToastVariant("warning");
            setShowToast(true);
            return;
        }


        try {
            const response = await fetch(
                "https://localhost:7234/api/MonthlyFee",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        price: parseFloat(price),
                        month: parseInt(month),
                        year: parseInt(year),
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setToastMessage("Cuota creada con éxito.");
            setToastVariant("success");
            setShowToast(true);
            setShowModal(false);
            setPrice("");
            setMonth("");
            setYear("");
            fetchMonthlyFees(); // refresca la tabla
        } catch (error) {
            console.error("Error creating fee:", error);
            setToastMessage("Error al crear la cuota.");
            setToastVariant("danger");
            setShowToast(true);

        }
    };

    const handleUpdateFee = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!price || !month || !year) {
            setToastMessage("Por favor, complete todos los campos.");
            setToastVariant("warning");
            setShowToast(true);
            return;
        }

        try {
            const response = await fetch(
                `https://localhost:7234/api/MonthlyFee/UpdateMonthlyFee/${selectedFeeId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        price: parseFloat(price),
                        month: parseInt(month),
                        year: parseInt(year),
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setToastMessage("Cuota actualizada con éxito.");
            setToastVariant("success");
            setShowToast(true);
            setShowModal(false);
            setPrice("");
            setMonth("");
            setYear("");
            setIsEditMode(false);
            setSelectedFeeId(null);
            fetchMonthlyFees(); // refresca la tabla
        } catch (error) {
            console.error("Error updating fee:", error);
            setToastMessage("Error al actualizar la cuota.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    const handleDelete = async (fee) => {
        const token = localStorage.getItem("jwtToken");

        if (!window.confirm("¿Estás seguro que deseas eliminar esta cuota?")) return;

        try {
            const response = await fetch(
                `https://localhost:7234/api/MonthlyFee/DeleteMonthlyFee/${fee.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setToastMessage("Cuota eliminada con éxito.");
            setToastVariant("success");
            setShowToast(true);
            fetchMonthlyFees(); // refresca la tabla
        } catch (error) {
            console.error("Error deleting fee:", error);
            setToastMessage("Error al eliminar la cuota.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };



    const handleEdit = (fee) => {
        setIsEditMode(true);
        setSelectedFeeId(fee.id);
        setPrice(fee.price.toString());
        setMonth(fee.month.toString());
        setYear(fee.year.toString());
        setShowModal(true);
    };


    return (
        <Container className="mt-5 container">
            <h3 className="mb-4">Listado de cuotas</h3>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                Crear nueva cuota
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Año</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {monthlyFees.length > 0 ? (
                        monthlyFees.map((monthlyFee) => (
                            <tr key={monthlyFee.id}>
                                <td>{monthlyFee.month}</td>
                                <td>{monthlyFee.year}</td>
                                <td>{monthlyFee.price}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleEdit(monthlyFee)}
                                    >
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(monthlyFee)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No se encontraron cuotas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setPrice("");
                setMonth("");
                setYear("");
                setIsEditMode(false);
                setSelectedFeeId(null);
            }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear nueva cuota mensual</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mes</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="12"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                                type="number"
                                min="2025"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant={isEditMode ? "warning" : "success"} onClick={isEditMode ? handleUpdateFee : handleCreateFee}>
                            {isEditMode ? "Actualizar cuota" : "Crear cuota"}
                        </Button>
                    </Form>
                </Modal.Body>
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
                            {toastVariant === "success"
                                ? "Éxito"
                                : toastVariant === "danger"
                                    ? "Error"
                                    : "Aviso"}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default MonthlyFee;
