import express from "express";
import dotenv from "dotenv";
import rotas from "./src/routes/notaRoute.js";

dotenv.config();

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Registra as rotas
rotas(app);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
    console.log(`Servidor está ouvindo na porta ${porta}...`);
});

app.use('/', (req, res) => {
    return res.json({ message: 'API de notas' });
}
);
