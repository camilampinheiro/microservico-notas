import { 
    obterTodasAsNotas, 
    obterNotaPorId, 
    criarNota, 
    atualizarNota, 
    excluirNota 
} from "../models/notaModel.js";

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
 * Calcula automaticamente a notaFinal com base em notaProva e notaTrabalho.
 */
export const criarNovaNota = tratarErros(async (req, res) => {
    const { notaProva, notaTrabalho } = req.body;

    // Verifica se os valores obrigatórios foram enviados
    if (notaProva === undefined || notaTrabalho === undefined) {
        return res.status(400).json({ erro: "notaProva e notaTrabalho são obrigatórios." });
    }

    // Calcula a notaFinal como a média
    const notaFinal = (notaProva + notaTrabalho) / 2;

    // Monta o objeto a ser salvo
    const novaNota = {
        notaProva,
        notaTrabalho,
        notaFinal
    };

    const notaCriada = await criarNota(novaNota);
    res.status(201).json(notaCriada);
});

/**
 * Controlador para atualizar uma nota existente.
 * Atualiza a notaFinal automaticamente se notaProva ou notaTrabalho forem enviados.
 */
export const atualizarNotaExistente = async (req, res) => {
    const id = req.params.id;
    const { notaProva, notaTrabalho } = req.body;

    try {
        // Busca a nota atual no banco para obter os valores existentes
        const notaAtual = await obterNotaPorId(id);
        if (!notaAtual) {
            return res.status(404).json({ erro: "Nota não encontrada para atualização." });
        }

        // Determina os valores de notaProva e notaTrabalho
        const novaNotaProva = notaProva !== undefined ? notaProva : notaAtual.notaProva;
        const novaNotaTrabalho = notaTrabalho !== undefined ? notaTrabalho : notaAtual.notaTrabalho;

        // Calcula a nova notaFinal com os valores atualizados
        const notaFinal = (novaNotaProva + novaNotaTrabalho) / 2;

        // Monta o objeto atualizado
        const notaAtualizada = {
            ...notaAtual,
            ...req.body, // Atualiza os valores enviados
            notaFinal, // Recalcula a notaFinal
        };

        // Atualiza no banco de dados
        const notaAtualizadaResultado = await atualizarNota(id, notaAtualizada);

        if (notaAtualizadaResultado.modifiedCount === 0) {
            return res.status(404).json({ erro: "Nenhuma alteração realizada na nota." });
        }

        res.status(200).json({ mensagem: "Nota atualizada com sucesso.", notaAtualizada });
    } catch (erro) {
        console.error("Erro ao atualizar nota:", erro.message);
        res.status(500).json({ erro: "Falha ao atualizar nota." });
    }
};

/**
 * Controlador para excluir uma nota.
 */
export const excluirNotaPorId = tratarErros(async (req, res) => {
    const id = req.params.id;
    const resultado = await excluirNota(id);
    res.status(200).json(resultado);
});
