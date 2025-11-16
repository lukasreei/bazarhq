import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, PlusCircle, Home, Archive } from "lucide-react";
import "./Topbar.css";
import logo from "../assets/logo1.png";


const Topbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="topbar">

      {/* Logo + título */}
      <div className="topbar-left">
        <img src={logo} className="logo-img" />
        <h1 className="topbar-title">DEMOLAY RIO TINTO</h1>
      </div>

      {/* Área da direita */}
      <div className="topbar-right">
        
        {/* Botões principais */}
        <div className="topbar-buttons">
          <button className="topbar-btn" onClick={() => navigate("/")}>
            <Home size={18} /> Home
          </button>

          {user && (
            <>
              <button className="topbar-btn" onClick={() => navigate("/add-hq")}>
                <PlusCircle size={18} /> Cadastrar HQ
              </button>

              <button className="topbar-btn" onClick={() => navigate("/estoque")}>
                <Archive size={18} /> Estoque
              </button>
            </>
          )}
        </div>

        {/* Usuário */}
        {user ? (
          <div className="user-section">
            <span className="user-info">👋 {user.email}</span>
            <button
              className="topbar-btn logout-btn"
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        ) : (
          <button className="topbar-btn login-btn" onClick={() => navigate("/login")}>
            <LogIn size={18} /> Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
