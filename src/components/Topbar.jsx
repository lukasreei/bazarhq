import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, PlusCircle, Home } from "lucide-react";
import "./Topbar.css";

const Topbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <h1 className="topbar-title">DEMOLAY RIO TINTO</h1>

      <div className="topbar-right">
        {/* Botão Home */}
        <button className="home-btn" onClick={() => navigate("/")}>
          <Home size={18} /> Home
        </button>

        {/* Botão Cadastrar HQ (apenas se logado) */}
        {user && (
          <button className="add-hq-btn" onClick={() => navigate("/add-hq")}>
            <PlusCircle size={18} /> Cadastrar HQ
          </button>
        )}

        {user ? (
          <>
            <span className="user-info">👋 {user.email}</span>
            <button
              className="logout-btn"
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              <LogOut size={18} /> Sair
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            <LogIn size={18} /> Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
