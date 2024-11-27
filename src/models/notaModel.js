import { ObjectId } from "mongodb";

const db = "trabalho";
const dbCollection = "notas";

export async function obterTodasAsNotas(req) {
  return req.dbClient.db(db).collection(dbCollection).find().toArray();
}

export async function obterNotaPorId(req, id) {
  return req.dbClient.db(db).collection(dbCollection).findOne({ _id: new ObjectId(id) });
}

export async function criarNota(req, nota) {
  return req.dbClient.db(db).collection(dbCollection).insertOne(nota);
}

export async function atualizarNota(req, id, notaAtualizada) {
  return req.dbClient
    .db(db)
    .collection(dbCollection)
    .updateOne({ _id: new ObjectId(id) }, { $set: notaAtualizada });
}

export async function excluirNotaPorId(req, id) {
  return req.dbClient.db(db).collection(dbCollection).deleteOne({ _id: new ObjectId(id) });
}
