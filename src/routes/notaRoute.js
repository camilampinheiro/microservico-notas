import express from "express";
import {
  listarNotas,
  criarNovaNota,
  atualizarDetalhesNota,
  excluirNota,
} from "../controllers/notaController.js";

const router = express.Router();

router.get("/notas", listarNotas);
router.post("/notas", criarNovaNota);
router.put("/notas/:id", atualizarDetalhesNota);
router.delete("/notas/:id", excluirNota);

export default router;
