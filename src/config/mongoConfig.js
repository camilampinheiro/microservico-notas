import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Carrega o arquivo .env

let mongoClient; // Armazena a conexão compartilhada com o banco de dados
/**
 * Conecta ao MongoDB e retorna o cliente conectado.
 *
 * @returns {Promise<MongoClient>} Uma instância conectada do MongoClient.
 */
export default async function conectarAoBancoDeDados() {
    if (!mongoClient) { // Verifica se a conexão já foi criada
        try {
            console.log('Conectando ao cluster do banco de dados...');
            mongoClient = new MongoClient(process.env.CONNECTION_STRING);
            await mongoClient.connect();
            console.log('Conectado com sucesso ao MongoDB Atlas!');
        } catch (erro) {
            console.error('Falha ao conectar ao banco de dados!', erro);
            throw erro; // Propaga o erro para quem chamou a função
        }
    }
    return mongoClient; // Retorna a conexão existente
}
