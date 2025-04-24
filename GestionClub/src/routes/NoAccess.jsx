// src/routes/NoAccess.jsx
import "../routes/NoAccess.css";
import naonao from "../assets/NoAccess.png";

const NoAccess = () => {
  return (
    <div className="no-access-container">
      <h1>Acceso Denegado</h1>
      <img src={naonao} alt="naonao" style={{ width: '200px', margin: '20px 0' }} />
      <p>No tienes permiso para acceder a esta página. Por favor, inicia sesión o verifica tus permisos.</p>
    </div>
  );
};

export default NoAccess;
