import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MercadoPagoButton from "../mercadoPago/MercadoPagoButton";
import "./PagoPage.css";

const PagoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { titulo, precio, cantidad, cuotaId, userId } = location.state || {};

  if (!titulo || !precio) {
    return (
      <div className="pago-container">
        <h4 className="status-title">No hay información válida para el pago.</h4>
        <button className="status-button" onClick={() => navigate("/mis-cuotas")}>
          Volver a Mis Cuotas
        </button>
      </div>
    );
  }

  return (
    <>
    <br/>
    <div className="pago-container">
      <h2 className="status-title">Resumen del Pago</h2>
      <div className="pago-details">
        <p><strong>Concepto:</strong> {titulo}</p>
        <p><strong>Precio:</strong> ${precio.toFixed(2)}</p>
        <p><strong>Cantidad:</strong> {cantidad}</p>
      </div>
      <hr />
      <MercadoPagoButton titulo={titulo} precio={precio} cantidad={cantidad} cuotaId={cuotaId} userId={userId} />
    </div>
    <br/>
    </>
  );
};

export default PagoPage;