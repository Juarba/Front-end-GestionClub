import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Container } from "react-bootstrap";
import { API_URL } from "../../services/api";
import './NewsList.css';

const NewsList = ({ refresh }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_URL}/News/GetAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al cargar noticias");
      const data = await response.json();
      setNews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [refresh]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      {news.map((item) => (
        <Card key={item.id} className="news-card">
          <div className="news-date-label">
            {new Intl.DateTimeFormat("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(item.date))}
          </div>

          {item.imageUrl && (
            <Card.Img
              variant="top"
              src={item.imageUrl}
              className="news-image"
            />
          )}

          <Card.Body>
            <Card.Title className="news-title">{item.title}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default NewsList;