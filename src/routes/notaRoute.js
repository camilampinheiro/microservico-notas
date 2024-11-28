import express from "express";
import cors from "cors";
import { 
  listarNotas, 
  obterNota, 
  criarNovaNota, 
  atualizarNotaExistente, 
  excluirNotaPorId 
} 
from "../controllers/notaController.js";

// Configurações de CORS
const opcoesCors = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

const rotas = (app) => {
    app.use(cors(opcoesCors));
    app.use(express.json());

    app.get("/notas", listarNotas);
    app.get("/notas/:id", obterNota);
    app.post("/notas", criarNovaNota);
    app.put("/notas/:id", atualizarNotaExistente);
    app.delete("/notas/:id", excluirNotaPorId);
};

export default rotas;