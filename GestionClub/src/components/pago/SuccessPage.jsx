import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import "./PagoStatus.css";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const cuotaId = params.get("cuotaId");

    if (userId && cuotaId) {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const markFeePaid = fetch("https://localhost:7234/api/Payment/mark-paid", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          userId: parseInt(userId),
          monthlyFeeId: parseInt(cuotaId),
        }),
      });

      const markUserPaid = fetch("https://localhost:7234/api/User/MarkUserPaid", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          userId: parseInt(userId),
        }),
      });

      Promise.all([markFeePaid, markUserPaid])
        .then(async ([res1, res2]) => {
          if (!res1.ok) throw new Error("Error al marcar la cuota como pagada.");
          if (!res2.ok) throw new Error("Error al marcar el usuario como pagado.");
        })
        .catch((err) => {
          console.error("Error en la actualización de estado:", err);
        });
    }
  }, [location]);

  return (
    <div className="pago-status-container">
      <CheckCircleFill className="status-icon success-icon" />
      <h2 className="status-message success-text">Pago realizado con éxito</h2>
      <Button className="mt-4" variant="success" onClick={() => navigate("/mis-cuotas")}>
        Volver a Mis Cuotas
      </Button>
    </div>
  );
};

export default SuccessPage;
