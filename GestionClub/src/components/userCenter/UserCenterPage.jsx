import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";
import "./UserCenterPage.css";

const getRoleName = (role) => {
  switch (parseInt(role)) {
    case 0:
      return "Admin";
    case 1:
      return "Cliente";
    case 2:
      return "Gerente";
    case 3:
      return "CM";
    default:
      return "Desconocido";
  }
};

const UserCenterPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    fetch("https://localhost:7234/api/User/GetAllUsers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error:", err);
        setToastMessage("Error al cargar usuarios");
        setToastVariant("danger");
        setShowToast(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`https://localhost:7234/api/User/UpdateUser/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: selectedUser.name,
          Email: selectedUser.email,
          PhoneNumber: selectedUser.phoneNumber,
          Rol: parseInt(selectedUser.rol),
          State: selectedUser.state,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const updated = users.map((u) => (u.id === selectedUser.id ? selectedUser : u));
      setUsers(updated);
      setToastMessage("Usuario actualizado con éxito");
      setToastVariant("success");
      setShowToast(true);
      setShowModal(false);
    } catch (err) {
      setToastMessage(err.message);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleRemoveUser = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`https://localhost:7234/api/User/DeleteUser/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setToastMessage("Usuario eliminado con éxito");
      setToastVariant("success");
      setShowToast(true);
    } catch (err) {
      setToastMessage("Hubo un error al eliminar el usuario");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  return (
    <Container className="usercenter-container">
      <h3 className="usercenter-title">Gestión de Usuarios</h3>

      {loading && <div className="spinner-center"><Spinner animation="border" /></div>}

      <Table className="user-table" responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{getRoleName(u.rol)}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td>{u.state ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button variant="outline-secondary" className="me-2" onClick={() => handleEdit(u)}>
                    <i class="bi bi-pencil-square"></i> Editar
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(u)}>
                    <i className="bi bi-trash" /> Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modales y Toast */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Usuario</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="name" value={selectedUser?.name || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={selectedUser?.email || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={selectedUser?.phoneNumber || ""} maxLength={10} onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setSelectedUser({ ...selectedUser, phoneNumber: onlyNums });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={selectedUser?.rol || ""} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="0">Admin</option>
                <option value="1">Cliente</option>
                <option value="2">Gerente</option>
                <option value="3">CM</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="switch"
              label="Activo"
              name="state"
              checked={selectedUser?.state || false}
              onChange={(e) => setSelectedUser({ ...selectedUser, state: e.target.checked })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirmar Eliminación</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que deseas eliminar a <strong>{selectedUser?.name}</strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleRemoveUser}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} bg={toastVariant} autohide delay={3000} onClose={() => setShowToast(false)}>
          <Toast.Header><strong className="me-auto">Notificación</strong></Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default UserCenterPage;
