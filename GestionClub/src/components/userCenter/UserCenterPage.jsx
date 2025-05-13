import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import "./UserCenterPage.css";

// Función para convertir el rol numérico a texto
const getRoleName = (role) => {
  switch (role) {
    case 0:
      return "Admin";
    case 1:
      return "Client";
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    const fetchUsers = async () => {
      try {
        const response = await fetch("https://localhost:7234/api/User/GetAllUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //Función para abrir el modal de edición
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  //Función para actualizar los datos del usuario
  const handleSave = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("jwtToken");

    try {
      const payload = {
        Name: selectedUser.name,
        Email: selectedUser.email,
        Password: selectedUser.password,
        PhoneNumber: selectedUser.phoneNumber,
        Rol: parseInt(selectedUser.rol),
      };


      const response = await fetch(`https://localhost:7234/api/User/UpdateUser/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? selectedUser : user
      );
      setUsers(updatedUsers);

      setToastMessage("Usuario actualizado con éxito.");
      setShowToast(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  //Función para cambiar los valores del formulario del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  //Función para "eliminar" (actualizar estado) un usuario
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(`https://localhost:7234/api/User/UpdateUserState/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, state: false } : user
      );

      setUsers(updatedUsers);

      setToastMessage("Usuario eliminado con éxito.");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-5 container">
      <h3 className="mb-4">Usuarios Registrados</h3>

      <Table striped bordered hover>
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
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{getRoleName(user.rol)}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.state ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(user)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Modal para Editar Usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedUser?.name || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedUser?.email || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={selectedUser?.password || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={selectedUser?.phoneNumber || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={selectedUser?.rol || ""}
                onChange={handleChange}
              >
                <option value="">Seleccionar rol</option>
                <option value="0">Admin</option>
                <option value="1">Cliente</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Toast de Notificación */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          bg="success"
          autohide
          delay={3000}
          onClose={() => setShowToast(false)}
        >
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default UserCenterPage;
