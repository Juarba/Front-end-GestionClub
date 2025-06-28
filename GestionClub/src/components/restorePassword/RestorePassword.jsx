import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../resetPassword/ResetPassword.css";

const RestorePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    try {
      const res = await fetch("https://localhost:7234/api/RecoverPassword/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const text = await res.text();
      setMessage(text);
    } catch (err) {
      setError("Ocurrió un error al cambiar la contraseña.");
    }
  };

  return (
    <div className="reset-pass-container">
      <div className="reset-pass-form-container">
        <h2 className="mb-4 text-center title-color">Restablecer Contraseña</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              isInvalid={newPassword !== confirmPassword && confirmPassword.length > 0}
            />
            <Form.Control.Feedback type="invalid">
              Las contraseñas no coinciden.
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mb-3">
            Cambiar Contraseña
          </Button>
        </Form>

        {error && <p className="text-danger text-center">{error}</p>}
        {message && <p className="text-success text-center">{message}</p>}
      </div>
    </div>
  );
};

export default RestorePassword;
