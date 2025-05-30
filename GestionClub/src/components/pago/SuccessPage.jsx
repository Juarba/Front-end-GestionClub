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

      fetch("https://localhost:7234/api/Payment/mark-paid", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          monthlyFeeId: parseInt(cuotaId),
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo actualizar la cuota como pagada.");
        })
        .catch((err) => {
          console.error("Error al marcar la cuota como pagada:", err);
        });
    }
  }, [location]);

  return <h2>Pago realizado con éxito ✅</h2>;
};

export default SuccessPage;
