import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CadastroHQ from "./pages/CadastroHQ/CadastroHQ";
import DetalhesHQ from "./pages/DetalhesHQ/DetalhesHQ";
import { getAuth, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  return (
    <Router>
      <Topbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/add-hq" element={<CadastroHQ user={user} />} />
        <Route path="/detalhes/:id" element={<DetalhesHQ />} />
        <Route path="*" element={<Home user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
