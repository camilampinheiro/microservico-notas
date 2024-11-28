import express from "express";
import cors from "cors";
import { 
  listarNotas, 
  obterNota, 
  criarNovaNota, 
  atualizarNotaExistente, 
  excluirNotaPorId 
} from "../controllers/notaController.js";

// Configurações de CORS
const opcoesCors = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200,
};

// Criar o roteador do Express
const router = express.Router();

// Configurar rotas
router.get("/notas", listarNotas);
router.get("/notas/:id", obterNota);
router.post("/notas", criarNovaNota);
router.put("/notas/:id", atualizarNotaExistente);
router.delete("/notas/:id", excluirNotaPorId);

// Configurar o aplicativo principal
const configurarRotas = (app) => {
    app.use(cors(opcoesCors));
    app.use(express.json());
    app.use(router); // Adiciona as rotas ao aplicativo principal
};

export default configurarRotas;

