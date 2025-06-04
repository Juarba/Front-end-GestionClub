import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();

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

  return <h2>Pago realizado con éxito ✅</h2>;
};

export default SuccessPage;
