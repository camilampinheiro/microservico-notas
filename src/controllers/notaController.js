import {
    obterTodasAsNotas,
    obterNotaPorId,
    criarNota,
    atualizarNota,
    excluirNota,
} from "../models/notaModel.js";
import fetch from "node-fetch";

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
 * Função para buscar dados do aluno no microserviço de Alunos.
 * Retorna os dados do aluno ou null caso não seja encontrado.
 */
async function buscarAluno(alunoId) {
    try {
        const response = await fetch(`https://student-service-umber.vercel.app/students/${alunoId}`);
        if (!response.ok) {
            console.error(`Aluno com ID ${alunoId} não encontrado.`);
            return null;
        }
        return await response.json();
    } catch (erro) {
        console.error(`Erro ao buscar aluno com ID ${alunoId}:`, erro.message);
        return null;
    }
}

/**
 * Controlador para listar todas as notas.
 */
export const listarNotas = tratarErros(async (req, res) => {
    const notas = await obterTodasAsNotas();

    const notasComAlunos = await Promise.all(
        notas.map(async (nota) => {
            // Usa o nome do aluno já salvo no banco, se existir
            return {
                ...nota, 
            };
        })
    );

    res.status(200).json(notasComAlunos);
});


/**
 * Controlador para criar uma nova nota.
 */
export const criarNovaNota = tratarErros(async (req, res) => {
    const { aluno_id, notaProva, notaTrabalho } = req.body;

    // Verificar se todos os dados obrigatórios foram enviados
    if (!aluno_id || notaProva === undefined || notaTrabalho === undefined) {
        return res.status(400).json({ erro: "aluno_id, disciplina_id, notaProva e notaTrabalho são obrigatórios." });
    }

    // Verificar se as notas estão no intervalo permitido
    if (notaProva < 0 || notaProva > 10 || notaTrabalho < 0 || notaTrabalho > 10) {
        return res.status(400).json({ erro: "As notas devem estar no intervalo de 0 a 10."});
    }

    // Verificar se o aluno existe no microserviço de Alunos
    const aluno = await buscarAluno(aluno_id);
    if (!aluno) {
        return res.status(404).json({ erro: "Aluno não encontrado no microserviço de Alunos." });
    }

    // Calcula a nota final
    const notaFinal = (notaProva + notaTrabalho) / 2;

    // Determinar o status com base na nota final
    const status = notaFinal >= 6 ? "Aprovado" : "Reprovado";

    const nomeAluno = aluno.name;

    // Criar o objeto de nota
    const novaNota = {
        aluno_id,
        nomeAluno,
        //disciplina_id,
        //disciplina,
        notaProva,
        notaTrabalho,
        notaFinal,
        status,
    };

    // Inserir no banco de dados
    const notaCriada = await criarNota(novaNota);

    res.status(201).json({
        mensagem: "Nota criada com sucesso.",
        nota: notaCriada,
    });
});

/**
 * Controlador para buscar uma nota pelo ID.
 */
export const obterNota = tratarErros(async (req, res) => {
    const id = req.params.id;

    // Busca a nota no banco
    const nota = await obterNotaPorId(id);

    if (!nota) {
        return res.status(404).json({ erro: "Nota não encontrada" });
    }

    // Busca os dados do aluno relacionado à nota
    const aluno = await buscarAluno(nota.aluno_id);

    // Reconstrói o objeto com o campo nomeAluno no lugar certo
    const notaComNome = {
        _id: nota._id,
        aluno_id: nota.aluno_id,
        nomeAluno: aluno ? aluno.name : "Aluno não encontrado",
        notaProva: nota.notaProva,
        notaTrabalho: nota.notaTrabalho,
        notaFinal: nota.notaFinal,
        status: nota.status,
    };

    res.status(200).json(notaComNome);
});

/**
 * Controlador para atualizar uma nota existente.
 */
export const atualizarNotaExistente = tratarErros(async (req, res) => {
    const id = req.params.id;
    const { notaProva, notaTrabalho } = req.body;

    // Busca a nota atual no banco para obter os valores existentes
    const notaAtual = await obterNotaPorId(id);

    if (!notaAtual) {
        return res.status(404).json({ erro: "Nota não encontrada para atualização." });
    }

    // Verificar se as notas enviadas estão no intervalo permitido
    if ((notaProva !== undefined && (notaProva < 0 || notaProva > 10)) || (notaTrabalho !== undefined && (notaTrabalho < 0 || notaTrabalho > 10))) {
        return res.status(400).json({ erro: "As notas devem estar no intervalo de 0 a 10." });
    }

    // Determina os valores de notaProva e notaTrabalho
    const novaNotaProva = notaProva !== undefined ? notaProva : notaAtual.notaProva;
    const novaNotaTrabalho = notaTrabalho !== undefined ? notaTrabalho : notaAtual.notaTrabalho;

    // Calcula a nova notaFinal com os valores atualizados
    const notaFinal = (novaNotaProva + novaNotaTrabalho) / 2;

    // Define o status com base na notaFinal
    const status = notaFinal >= 6 ? "Aprovado" : "Reprovado";

    // Busca os dados do aluno e obtém apenas o nome
    const aluno = await buscarAluno(notaAtual.aluno_id);
    const nomeAluno = aluno ? aluno.name : "Aluno não encontrado";
    

    // Monta o objeto atualizado
    const notaAtualizada = {
        ...notaAtual,
        ...req.body,
        nomeAluno,
        notaFinal,
        status,
    };

    // Atualiza no banco de dados
    const resultado = await atualizarNota(id, notaAtualizada);

    if (resultado.modifiedCount === 0) {
        return res.status(404).json({ erro: "Nenhuma alteração realizada na nota." });
    }

    res.status(200).json({
        mensagem: "Nota atualizada com sucesso.",
        nota: notaAtualizada,
    });
});


/**
 * Controlador para excluir uma nota.
 */
export const excluirNotaPorId = tratarErros(async (req, res) => {
    const id = req.params.id;
    const resultado = await excluirNota(id);
    res.status(200).json({
        mensagem: "Nota excluída com sucesso.", 
        resultado: resultado,
    });
});
