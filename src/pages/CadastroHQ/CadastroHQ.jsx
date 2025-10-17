import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CadastroHQ.css";

export default function CadastroHQ({ user }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("acao");
  const [whatsapp, setWhatsapp] = useState("");
  const [images, setImages] = useState([]); // array de arquivos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <p>Você precisa estar logado para cadastrar HQs.</p>;

  // adiciona imagens, até no máximo 3
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("Você pode enviar no máximo 3 imagens.");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !whatsapp || images.length === 0) {
      setError("Preencha todos os campos e selecione pelo menos 1 imagem.");
      return;
    }

    setLoading(true);

    try {
      // Upload de todas as imagens para Storage
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `hqs/${Date.now()}-${images[i].name}`);
        await uploadBytes(imageRef, images[i]);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // Cadastro no Firestore
      await addDoc(collection(db, "hqs"), {
        title,
        description,
        price,
        category,
        whatsapp,
        images: imageUrls, // salva array de URLs
        createdAt: Timestamp.now(),
        userId: user.uid,
      });

      setLoading(false);
      navigate("/"); // volta para Home
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar HQ.");
      setLoading(false);
    }
  };

  return (
    <div className="cadastrohq-container">
      <h2>Cadastro de HQ</h2>
      <form onSubmit={handleSubmit} className="cadastrohq-form">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="acao">Ação</option>
          <option value="aventura">Aventura</option>
          <option value="super-heroi">Conto</option>
          <option value="super-heroi">HQ</option>
          <option value="super-heroi">Shounen</option>
          <option value="super-heroi">Super-herói</option>
          <option value="super-heroi">Romamnce</option>
        </select>
        <input
          type="text"
          placeholder="WhatsApp (somente números)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
        />

        {/* Upload de múltiplas imagens */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImagesChange}
          multiple
        />

        {/* Preview das imagens */}
        <div className="image-preview">
          {images.map((img, index) => (
            <div key={index} className="preview-item">
              <img src={URL.createObjectURL(img)} alt="preview" />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                ×
              </button>
            </div>
          ))}
        </div>

        {error && <p className="cadastrohq-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar HQ"}
        </button>
      </form>
    </div>
  );
}
