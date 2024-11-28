import { obterTodasAsNotas, obterNotaPorId, criarNota, atualizarNota, excluirNota } from "../models/notaModel.js";

/**
 * Função auxiliar para manipulação de erros.
 * @param {Function} func - Função assíncrona do controlador.
 * @returns {Function} Função middleware para lidar com erros.
 */
const tratarErros = (func) => async (req, res) => {
    try {
        await func(req, res);
    } catch (erro) {
        console.error("Erro:", erro.message);
        res.status(500).json({ erro: "Ocorreu um erro no servidor" });
    }
};

/**
 * Controlador para listar todas as notas.
 */
export const listarNotas = tratarErros(async (req, res) => {
    const notas = await obterTodasAsNotas();
    res.status(200).json(notas);
});

/**
 * Controlador para buscar uma nota pelo ID.
 */
export const obterNota = tratarErros(async (req, res) => {
    const id = req.params.id;
    const nota = await obterNotaPorId(id);
    if (!nota) {
        return res.status(404).json({ erro: "Nota não encontrada" });
    }
    res.status(200).json(nota);
});

/**
 * Controlador para criar uma nova nota.
 */
export const criarNovaNota = tratarErros(async (req, res) => {
    const novaNota = req.body;
    const notaCriada = await criarNota(novaNota);
    res.status(201).json(notaCriada);
});

/**
 * Controlador para atualizar uma nota existente.
 */
export const atualizarNotaExistente = tratarErros(async (req, res) => {
    const id = req.params.id;
    const notaAtualizada = req.body;
    const notaAtualizadaResultado = await atualizarNota(id, notaAtualizada);
    res.status(200).json(notaAtualizadaResultado);
});

/**
 * Controlador para excluir uma nota.
 */
export const excluirNotaPorId = tratarErros(async (req, res) => {
    const id = req.params.id;
    const resultado = await excluirNota(id);
    res.status(200).json(resultado);
});
