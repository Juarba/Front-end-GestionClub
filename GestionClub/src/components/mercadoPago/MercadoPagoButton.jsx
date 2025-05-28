import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const MercadoPagoButton = ({ titulo, precio, cantidad }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago('APP_USR-f4b6c36b-8ea6-45a9-8bd5-26367bd6a3b4'); // Reemplazá con tu public key real

    const crearPreferencia = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch("https://localhost:7234/api/MercadoPago/crear-preferencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            titulo,
            precio,
            cantidad
          })
        });

        if (!response.ok) {
          throw new Error(`Error al crear preferencia: ${response.status}`);
        }

        const data = await response.json();
        const id = data.url.split("pref_id=")[1];
        setPreferenceId(id);
      } catch (error) {
        console.error("Error al crear la preferencia:", error);
      }
    };

    crearPreferencia();
  }, [titulo, precio, cantidad]);

  return (
    <div>
      <h3>Pagar con Mercado Pago</h3>
      {preferenceId ? (
        <div style={{ width: '300px' }}>
          <Wallet initialization={{ preferenceId }} />
        </div>
      ) : (
        <p>Cargando botón de pago...</p>
      )}
    </div>
  );
};

export default MercadoPagoButton;
