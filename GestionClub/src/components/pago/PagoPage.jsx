// src/components/pago/PagoPage.jsx
import React from 'react';
import MercadoPagoButton from '../mercadoPago/MercadoPagoButton';

const PagoPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Realizar Pago</h2>
      <MercadoPagoButton titulo="Membresía mensual" precio={1} cantidad={1} />
    </div>
  );
};

export default PagoPage;
