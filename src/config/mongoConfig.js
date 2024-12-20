import { MongoClient } from 'mongodb'; // Importa o cliente do MongoDB

let mongoClient; // Armazena a conexão compartilhada com o banco de dados
/**
 * Conecta ao MongoDB e retorna o cliente conectado.
 *
 * @returns {Promise<MongoClient>} Uma instância conectada do MongoClient.
 */
export default async function conectarAoBancoDeDados() {
    if (!mongoClient) { 
        try {
            console.log('Conectando ao cluster do banco de dados...');
            mongoClient = new MongoClient(process.env.CONNECTION_STRING);
            await mongoClient.connect();
            console.log('Conectado com sucesso ao MongoDB Atlas!');
        } catch (erro) {
            console.error('Falha ao conectar ao banco de dados!', erro);
            throw erro; 
        }
    }
    return mongoClient; 
}