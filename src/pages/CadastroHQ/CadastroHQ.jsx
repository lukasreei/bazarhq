// src/pages/CadastroHQ/CadastroHQ.jsx
import React, { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CadastroHQ() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      let urlImagem = "";
      if (imagem) {
        const storageRef = ref(storage, `hqs/${imagem.name}`);
        await uploadBytes(storageRef, imagem);
        urlImagem = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "hqs"), { nome, preco, imagem: urlImagem });
      alert("HQ cadastrada com sucesso!");
      setNome("");
      setPreco("");
      setImagem(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cadastro de HQ</h2>
      <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
        <input type="file" onChange={e => setImagem(e.target.files[0])} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
