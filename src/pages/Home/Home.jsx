import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [hqs, setHqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultHqs = [
      {
        id: 1,
        title: "A Lenda do Cavaleiro",
        description: "Uma jornada épica sobre coragem e honra.",
        price: "R$ 29,90",
        image: "https://m.media-amazon.com/images/I/81aLZ6nLq8L.jpg",
        whatsapp: "5583988888888",
      },
      {
        id: 2,
        title: "Sombras da Lua",
        description: "Uma história sombria de mistério e magia.",
        price: "R$ 19,90",
        image: "https://m.media-amazon.com/images/I/71h7XoH0k-L.jpg",
        whatsapp: "5583988888888",
      },
    ];

    const fetchHqs = async () => {
      try {
        const hqsCollection = collection(db, "hqs");
        const snapshot = await getDocs(hqsCollection);
        const firestoreHqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (firestoreHqs.length > 0) {
          setHqs(firestoreHqs);
        } else {
          setHqs(defaultHqs);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar HQs:", error);
        setHqs(defaultHqs);
        setLoading(false);
      }
    };

    fetchHqs();
  }, []);

  if (loading) return <p>Carregando HQs...</p>;

  return (
    <div className="home-container">
      <h2 className="home-title">HQs Disponíveis</h2>

      {/* Botão para adicionar HQs apenas para usuários logados */}
      {user && (
        <button
          className="add-hq-btn"
          onClick={() => navigate("/add-hq")}
        >
          + Cadastrar HQ
        </button>
      )}

      {hqs.length === 0 ? (
        <p>Nenhuma HQ cadastrada ainda 😕</p>
      ) : (
        <div className="hq-grid">
          {hqs.map((hq) => (
            <div key={hq.id} className="hq-card">
              <img src={hq.image} alt={hq.title} className="hq-image" />
              <h3>{hq.title}</h3>
              <p className="hq-description">{hq.description}</p>
              <p className="hq-price">{hq.price}</p>

              <div className="hq-buttons">
                <button onClick={() => navigate(`/hq/${hq.id}`)}>Ver mais</button>
                <a
                  href={`https://wa.me/${hq.whatsapp}?text=Olá! Tenho interesse na HQ "${hq.title}"`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="whatsapp-btn">Falar no WhatsApp</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;