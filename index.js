import express from "express";
import dotenv from 'dotenv';
import rotas from "./src/routes/notaRoute.js";

dotenv.config();

const app = express();

rotas(app);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
    console.log(`Servidor está ouvindo na porta ${porta}...`);
});

app.get('/', (req, res) => {
    res.send('API do Microserviço de Notas funcionando!');
});

