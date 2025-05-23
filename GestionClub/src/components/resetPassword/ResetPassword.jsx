import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import { useState } from "react";

const ResetPassword = () => {
    const [email, setEmail] = useState('')
      const [message, setMessage] = useState("");

    const handleSendEmail = async () => {
        console.log("Payload enviado:", JSON.stringify({ email }));
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
            alert("Ocurrió un error al enviar el correo.");
        }
    }

    return (
        <div className="reset-pass-container">
            <div className="reset-pass-form-container">
                <div>
                    <h2 className="mb-4 text-center">Cambiar contraseña</h2>
                </div>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" className="w-100 mb-3" onClick={handleSendEmail} >
                    Cambiar Contraseña
                </Button>
                {message && <p>{message}</p>}

                <div className="login-prompt">
                    <small>
                        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesion</Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;