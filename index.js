import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import rotasNota from "./src/routes/notaRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
let clienteMongo;
const conectarAoBancoDeDados = async () => {
  try {
    clienteMongo = new MongoClient(process.env.CONNECTION_STRING);
    await clienteMongo.connect();
    console.log("Conexão com o MongoDB realizada com sucesso!");
  } catch (erro) {
    console.error("Erro ao conectar ao MongoDB:", erro);
    process.exit(1);
  }
};

// Middleware para injetar o cliente Mongo nos controladores
app.use((req, res, next) => {
  req.dbClient = clienteMongo;
  next();
});

// Rotas
app.use("/api", rotasNota);

// Iniciar o Servidor
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, async () => {
  await conectarAoBancoDeDados();
  console.log(`Servidor rodando na porta ${PORTA}`);
});
