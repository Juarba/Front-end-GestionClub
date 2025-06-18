import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    try {
      const response = await fetch("https://localhost:7234/api/RecoverPassword/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el correo. Verificá el email e intentá de nuevo.");
      }

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      setMessage("Ocurrió un error al enviar el correo.");
    }
  };

  return (
    <div className="reset-pass-container">
      <div className="reset-pass-form-container">
        <h2 className="text-center mb-4 title-color">Cambiar contraseña</h2>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" className="w-100 mb-3" onClick={handleSendEmail}>
          Enviar enlace de recuperación
        </Button>

        {message && (
          <div className="text-center mt-2">
            <small className="text-success">{message}</small>
          </div>
        )}

        <div className="login-prompt">
          <small>
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
