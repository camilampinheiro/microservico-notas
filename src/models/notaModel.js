import { ObjectId } from "mongodb";
import conectarAoBancoDeDados from "../config/mongoConfig.js";

// Helper para acessar a coleção "notas"
async function colecaoNotas() {
    const conexao = await conectarAoBancoDeDados(process.env.CONNECTION_STRING);
    return conexao.db("sistema-escolar").collection("notas");
}

// Operações CRUD
export const obterTodasAsNotas = async () => (await colecaoNotas()).find().toArray();

export const obterNotaPorId = async (id) => 
    (await colecaoNotas()).findOne({ _id: new ObjectId(id) });

export const criarNota = async (novaNota) => 
    (await colecaoNotas()).insertOne(novaNota);

export const atualizarNota = async (id, notaAtualizada) => 
    (await colecaoNotas()).updateOne({ _id: new ObjectId(id) }, { $set: notaAtualizada });

export const excluirNota = async (id) => 
    (await colecaoNotas()).deleteOne({ _id: new ObjectId(id) });
