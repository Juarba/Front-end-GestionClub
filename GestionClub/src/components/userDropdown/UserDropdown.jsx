import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Modal,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserDropdown.css";


const UserDropdown = ({ logout }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const token = localStorage.getItem("jwtToken");

  const handleShow = () => {
    setShowModal(true);
    fetchUserData();
  };

  const handleClose = () => {
    // Si está editando, confirmamos antes de cerrar
    if (isEditing) {
      if (
        window.confirm(
          "Tienes cambios sin guardar. ¿Estás seguro que quieres cerrar sin guardar?"
        )
      ) {
        setIsEditing(false);
        setShowModal(false);
      }
    } else {
      setShowModal(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "https://localhost:7234/api/User/GetCurrentUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setToastMessage("Error al cargar los datos del usuario.");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleEdit = () => {
    setEditData({
      name: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
    });
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    // Validación simple
    if (!editData.name.trim() || !editData.email.trim()) {
      setToastMessage("Nombre y Email son obligatorios.");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7234/api/User/UpdateCurrentUser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      setUserData(editData);
      setIsEditing(false);
      setShowModal(false);
      setToastMessage("Usuario editado correctamente.");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setToastMessage(`Error al guardar: ${error.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleMisReservas = () => {
    navigate("/misReservas")
  }

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    logout();
    navigate("/login");
  };

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle variant="dark">
          <i className="bi bi-person-circle" style={{ fontSize: "1.3rem" }}></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShow}>Mi cuenta</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/mis-cuotas")}>Mis Cuotas</Dropdown.Item>
          <Dropdown.Item onClick={handleMisReservas}>Mis reservas</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mi cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userData ? (
            isEditing ? (
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.phoneNumber}
                    maxLength={10}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setEditData({ ...editData, phoneNumber: onlyNums });
                    }}
                  />
                </div>
              </form>
            ) : (
              <div>
                <p>
                  <strong>Nombre:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {userData.phoneNumber}
                </p>
              </div>
            )
          ) : (
            <p>Cargando datos...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveChanges}>
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleEdit}>
                Editar
              </Button>
            </>
          )}
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
    </>
  );
};

export default UserDropdown;
