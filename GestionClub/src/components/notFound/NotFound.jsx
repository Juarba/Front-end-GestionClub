import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './NotFound.css';
import notfound from "../../../public/images/notfoundsinfondo.png";

const NotFound = () => {
    const navigate = useNavigate();

    const goBackHandler = () => {
        navigate("/");
    };
    return (
        <>
            
            <div className="not-found-container">
                <img src={notfound} alt="Página no encontrada" className="not-found-image" />
                <h1 className="not-found-title">Error 404</h1>
                <h2 className="not-found-subtitle">Pagina no encontrada</h2>
                <p className="not-found-text">
                    La pagina que estás buscando <br/> no está disponible
                </p>
                <Button className="not-found-button" onClick={goBackHandler}>
                    Volver al inicio
                </Button>
            </div>
        </>
    );
};

export default NotFound;