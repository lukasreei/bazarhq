import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [hqs, setHqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // busca por título
  const [categoryFilter, setCategoryFilter] = useState("all"); // filtro de categoria
  const [sortOrder, setSortOrder] = useState("asc"); // ordenação A→Z ou Z→A

  useEffect(() => {
    const fetchHqs = async () => {
      try {
        const hqsCollection = collection(db, "hqs");
        const snapshot = await getDocs(hqsCollection);
        const firestoreHqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHqs(firestoreHqs);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar HQs:", error);
        setHqs([]);
        setLoading(false);
      }
    };

    fetchHqs();
  }, []);

  if (loading) return <p className="loading">Carregando HQs...</p>;

  // Filtra e ordena HQs
  const filteredHqs = hqs
    .filter(
      (hq) =>
        hq.title.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter === "all" || hq.category === categoryFilter)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  return (
    <div className="home-container">
      <h2 className="home-title">HQs Disponíveis</h2>

      {/* Botão para adicionar HQs apenas para usuários logados */}
      {user && (
        <button className="add-hq-btn" onClick={() => navigate("/add-hq")}>
          + Cadastrar HQ
        </button>
      )}

      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar HQ pelo título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas as categorias</option>
          <option value="acao">Ação</option>
          <option value="aventura">Aventura</option>
          <option value="super-heroi">Super-herói</option>
          {/* Adicione mais categorias conforme necessário */}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-select"
        >
          <option value="asc">Ordem alfabética: A → Z</option>
          <option value="desc">Ordem alfabética: Z → A</option>
        </select>
      </div>

      {/* Grid de HQs */}
      {filteredHqs.length === 0 ? (
        <p>Nenhuma HQ encontrada 😕</p>
      ) : (
        <div className="hq-grid">
          {filteredHqs.map((hq) => (
            <div
              key={hq.id}
              className={`hq-card ${hq.soldOut ? "hq-esgotado-card" : ""}`}
            >
              <img src={hq.image} alt={hq.title} className="hq-image" />
              <h3>{hq.title}</h3>
              <p className="hq-description">{hq.description}</p>

              {/* Status ou preço */}
              {hq.soldOut ? (
                <p
                  className="hq-esgotado"
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  ⚠️ Esgotado
                </p>
              ) : (
                <p className="hq-price">{hq.price}</p>
              )}

              <div className="hq-buttons">
                <button onClick={() => navigate(`/detalhes/${hq.id}`)}>
                  Ver mais
                </button>

                {!hq.soldOut && (
                  <a
                    href={`https://wa.me/${hq.whatsapp}?text=Olá! Tenho interesse na HQ "${hq.title}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="whatsapp-btn">Falar no WhatsApp</button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
