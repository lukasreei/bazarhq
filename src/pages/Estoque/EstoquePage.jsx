import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // seu arquivo de config
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const EstoquePage = ({ user }) => {
  const [hqs, setHqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHqs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "hqs"));
      const hqList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHqs(hqList);
    } catch (error) {
      console.error("Erro ao buscar HQs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHqs();
  }, []);

  const handleUpdateQuantity = async (hqId, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      const hqRef = doc(db, "hqs", hqId);
      const updatedData = {
        quantity: newQuantity,
        soldOut: newQuantity === 0
      };
      await updateDoc(hqRef, updatedData);

      setHqs((prev) =>
        prev.map((hq) =>
          hq.id === hqId ? { ...hq, ...updatedData } : hq
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  if (loading) return <p>Carregando HQs...</p>;

  return (
    <div>
      <h1>Estoque de HQs</h1>
      <div className="hq-list">
        {hqs.map((hq) => (
          <div key={hq.id} className="hq-card">
            <h2>{hq.title}</h2>
            <p>Status: {hq.soldOut ? "Esgotado" : "Disponível"}</p>
            <p>Quantidade: {hq.quantity}</p>

            {user && (
              <div>
                <input
                  type="number"
                  min="0"
                  value={hq.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(hq.id, parseInt(e.target.value))
                  }
                />
                {hq.quantity === 0 && <span> ⚠️ Esgotado!</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstoquePage;
