import {
    obterTodasAsNotas,
    obterNotaPorId,
    criarNota,
    atualizarNota,
    excluirNotaPorId,
  } from "../models/notaModel.js";
  import fetch from "node-fetch";
  
  /**
   * Lista todas as notas com informações detalhadas de aluno e disciplina.
   */
  export async function listarNotas(req, res) {
    try {
      const notas = await obterTodasAsNotas(req);
  
      const notasDetalhadas = await Promise.all(
        notas.map(async (nota) => {
          const aluno = await fetch(`${process.env.ALUNO_API}/${nota.aluno_id}`).then((res) =>
            res.json()
          );
          const disciplina = await fetch(`${process.env.DISCIPLINA_API}/${nota.disciplina_id}`).then(
            (res) => res.json()
          );
  
          return {
            notaProva: nota.notaProva,
            notaTrabalho: nota.notaTrabalho,
            notaFinal: nota.notaFinal,
            aluno: aluno.nome,
            disciplina: disciplina.nome,
          };
        })
      );
  
      res.status(200).json(notasDetalhadas);
    } catch (erro) {
      console.error("Erro ao listar notas:", erro);
      res.status(500).json({ erro: "Não foi possível buscar as notas" });
    }
  }
  
  /**
   * Cria uma nova nota.
   */
  export async function criarNovaNota(req, res) {
    try {
      const { aluno_id, disciplina_id, notaProva, notaTrabalho } = req.body;
      const notaFinal = (notaProva + notaTrabalho) / 2;
  
      const novaNota = {
        aluno_id,
        disciplina_id,
        notaProva,
        notaTrabalho,
        notaFinal,
      };
  
      const resultado = await criarNota(req, novaNota);
      res.status(201).json(resultado);
    } catch (erro) {
      console.error("Erro ao criar nota:", erro);
      res.status(500).json({ erro: "Não foi possível criar a nota" });
    }
  }
  
  /**
   * Atualiza uma nota existente.
   */
  export async function atualizarDetalhesNota(req, res) {
    try {
      const { id } = req.params;
      const { notaProva, notaTrabalho } = req.body;
      const notaFinal = (notaProva + notaTrabalho) / 2;
  
      const notaAtualizada = {
        notaProva,
        notaTrabalho,
        notaFinal,
      };
  
      const resultado = await atualizarNota(req, id, notaAtualizada);
      res.status(200).json(resultado);
    } catch (erro) {
      console.error("Erro ao atualizar nota:", erro);
      res.status(500).json({ erro: "Não foi possível atualizar a nota" });
    }
  }
  
  /**
   * Exclui uma nota pelo ID.
   */
  export async function excluirNota(req, res) {
    try {
      const { id } = req.params;
      const resultado = await excluirNotaPorId(req, id);
      res.status(200).json(resultado);
    } catch (erro) {
      console.error("Erro ao excluir nota:", erro);
      res.status(500).json({ erro: "Não foi possível excluir a nota" });
    }
  }
  