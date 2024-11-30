import express from "express";
import dotenv from "dotenv";
import rotas from "./src/routes/notaRoute.js";
import conectarAoBancoDeDados from "./src/config/mongoConfig.js"; // Caminho da função de conexão ao MongoDB

dotenv.config();

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Conectar ao banco de dados antes de iniciar o servidor
(async () => {
    try {
        await conectarAoBancoDeDados(); // Conecta ao MongoDB
        console.log("Conexão ao banco de dados estabelecida.");
    } catch (erro) {
        console.error("Erro ao conectar ao banco de dados:", erro);
    }
})();

// Registra as rotas
rotas(app);

// Rota padrão
app.use('/', (req, res) => {
    return res.send('Microserviço de notas funcionando!');
});

// Inicia o servidor
const porta = process.env.PORT || 3000;

app.listen(porta, () => {
    console.log(`Servidor está ouvindo na porta ${porta}...`);
});
