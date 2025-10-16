// src/pages/DetalhesHQ/DetalhesHQ.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DetalhesHQ() {
  const { id } = useParams();
  const [hq, setHq] = useState(null);

  useEffect(() => {
    const fetchHQ = async () => {
      const docRef = doc(db, "hqs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHq(docSnap.data());
      }
    };
    fetchHQ();
  }, [id]);

  if (!hq) return <p>Carregando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{hq.nome}</h2>
      <p>Preço: R${hq.preco}</p>
      {hq.imagem && <img src={hq.imagem} alt={hq.nome} width="200" />}
    </div>
  );
}
