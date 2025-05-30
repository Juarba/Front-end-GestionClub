// src/components/pago/PagoPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MercadoPagoButton from "../mercadoPago/MercadoPagoButton";

const PagoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { titulo, precio, cantidad, cuotaId, userId } = location.state || {};

  if (!titulo || !precio) {
    return (
      <div style={{ padding: "2rem" }}>
        <h4>No hay información válida para el pago.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/mis-cuotas")}>
          Volver a Mis Cuotas
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Resumen del Pago</h2>
      <div className="mb-4">
        <p><strong>Concepto:</strong> {titulo}</p>
        <p><strong>Precio:</strong> ${precio.toFixed(2)}</p>
        <p><strong>Cantidad:</strong> {cantidad}</p>
      </div>
      <hr />
      <MercadoPagoButton titulo={titulo} precio={precio} cantidad={cantidad} cuotaId={cuotaId} userId={userId} />
    </div>
  );
};

export default PagoPage;
