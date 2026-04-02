/**
 * 📦 Barrel Export - Domínio
 * Centraliza exports de todas as classes de domínio
 */

// Enums
export * from './enums/recompensa.enum';
export * from './enums/rotina.enum';

// Domain Classes
export { Usuario } from './usuario/usuario';
export { Perfil } from './perfil/perfil';
export { Rotina } from './rotina/rotina';
export { Tarefa } from './rotina/tarefa/tarefa';
export { 
  ITarefaState, 
  TarefaPendente, 
  TarefaEmAndamento, 
  TarefaConcluida,
  ETarefaEstado
} from './rotina/tarefa/tarefa-state';
export { 
  ICalculadorProgresso,
  EstrategiaProgresoLinear,
  EstrategiaProgresoComPeso,
  EstrategiaProgresoExponencial
} from './rotina/rotina-strategy';
export { Recompensa } from './recompensa/recompensa';
export { ItemLoja, ETipoItem } from './loja/item-loja';
