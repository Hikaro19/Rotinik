/**
 * 🎯 Padrão State - Estados de Tarefa
 * Implementa transições de estado usando o padrão State
 */

import type { Tarefa } from './tarefa';

export enum ETarefaEstado {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
}

/**
 * Interface para implementar Estados da Tarefa
 */
export interface ITarefaState {
  /**
   * Conclui a tarefa
   */
  concluir(tarefa: Tarefa): void;

  /**
   * Inicia a tarefa
   */
  iniciar(tarefa: Tarefa): void;

  /**
   * Volta para pendente
   */
  pendente(tarefa: Tarefa): void;

  /**
   * Retorna nome do estado
   */
  obterNome(): string;

  /**
   * Retorna enum do estado
   */
  obterEstado(): ETarefaEstado;
}

/**
 * Estado: Tarefa Pendente
 * Permite iniciar ou concluir (se não houver dependências)
 */
export class TarefaPendente implements ITarefaState {
  concluir(tarefa: Tarefa): void {
    tarefa.mudarEstado(new TarefaConcluida());
    console.log(`✅ Tarefa "${tarefa.getTitulo()}" concluída!`);
  }

  iniciar(tarefa: Tarefa): void {
    tarefa.mudarEstado(new TarefaEmAndamento());
    console.log(`⏱️ Tarefa "${tarefa.getTitulo()}" iniciada!`);
  }

  pendente(tarefa: Tarefa): void {
    // Já está pendente, nada faz
  }

  obterNome(): string {
    return 'Pendente';
  }

  obterEstado(): ETarefaEstado {
    return ETarefaEstado.PENDENTE;
  }
}

/**
 * Estado: Tarefa Em Andamento
 * Permite concluir ou voltar para pendente
 */
export class TarefaEmAndamento implements ITarefaState {
  concluir(tarefa: Tarefa): void {
    tarefa.mudarEstado(new TarefaConcluida());
    console.log(`✅ Tarefa "${tarefa.getTitulo()}" concluída!`);
  }

  iniciar(tarefa: Tarefa): void {
    // Já está em andamento, nada faz
  }

  pendente(tarefa: Tarefa): void {
    tarefa.mudarEstado(new TarefaPendente());
    console.log(`↩️ Tarefa "${tarefa.getTitulo()}" voltou a pendente`);
  }

  obterNome(): string {
    return 'Em Andamento';
  }

  obterEstado(): ETarefaEstado {
    return ETarefaEstado.EM_ANDAMENTO;
  }
}

/**
 * Estado: Tarefa Concluída
 * Não permite transições diretas (apenas para pendente)
 */
export class TarefaConcluida implements ITarefaState {
  concluir(tarefa: Tarefa): void {
    // Já está concluída, nada faz
  }

  iniciar(tarefa: Tarefa): void {
    throw new Error(`❌ Não é possível iniciar tarefa "${tarefa.getTitulo()}" que já foi concluída`);
  }

  pendente(tarefa: Tarefa): void {
    tarefa.mudarEstado(new TarefaPendente());
    console.log(`↩️ Tarefa "${tarefa.getTitulo()}" reabertu para pendente`);
  }

  obterNome(): string {
    return 'Concluída';
  }

  obterEstado(): ETarefaEstado {
    return ETarefaEstado.CONCLUIDA;
  }
}
