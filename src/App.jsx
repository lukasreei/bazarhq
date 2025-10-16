import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CadastroHQ from "./pages/CadastroHQ/CadastroHQ";
import DetalhesHQ from "./pages/DetalhesHQ/DetalhesHQ";

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroHQ />} />
        <Route path="/detalhes/:id" element={<DetalhesHQ />} />
      </Routes>
    </Router>
  );
}

export default App;
