import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./DetalhesHQ.css";

export default function DetalhesHQ() {
  const { id } = useParams();
  const [hq, setHq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHQ = async () => {
      try {
        const docRef = doc(db, "hqs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHq(docSnap.data());
        } else {
          console.log("HQ não encontrada!");
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar HQ:", err);
        setLoading(false);
      }
    };

    fetchHQ();
  }, [id]);

  if (loading) return <p>Carregando HQ...</p>;
  if (!hq) return <p>HQ não encontrada 😕</p>;

  // garante que hq.images é um array
  const images = Array.isArray(hq.images) ? hq.images : [];

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="detalheshq-container">
      <h2>{hq.title}</h2>

      {/* Carrossel de imagens */}
      {images.length > 0 && (
        <div className="carousel">
          <button className="carousel-btn prev" onClick={handlePrev}>
            ‹
          </button>
          <img
            src={images[currentImage]}
            alt={hq.title}
            className="carousel-img"
          />
          <button className="carousel-btn next" onClick={handleNext}>
            ›
          </button>
        </div>
      )}

      <p className="hq-description">{hq.description}</p>
      <p className="hq-category">Categoria: {hq.category}</p>
      <p className="hq-price">Preço: {hq.price}</p>

      <a
        href={`https://wa.me/${hq.whatsapp}?text=Olá! Tenho interesse na HQ "${hq.title}"`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="whatsapp-btn">Falar no WhatsApp</button>
      </a>
    </div>
  );
}
