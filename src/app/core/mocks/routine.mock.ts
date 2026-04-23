import { Usuario, Rotina, Tarefa, EFrequencia, EDificuldadeTarefa } from '@core/models/domain';

export function createMockRoutineUser(): Usuario {
  const user = new Usuario('Hikaro', 'hikaro@rotinik.com');
  user.ganharMoedas(50);

  const studyRoutine = new Rotina(
    'Rotina De Estudos',
    'Estudos',
    'Estudo de Programacao Orientada a Objetos',
    EFrequencia.DIARIA,
  );
  studyRoutine.adicionarTarefa(
    new Tarefa('Ler documentacao Angular', 'Estudar componentes standalone', 15, 8, EDificuldadeTarefa.FACIL),
  );
  studyRoutine.adicionarTarefa(
    new Tarefa('Praticar TypeScript', 'Resolver exercicios de tipos', 25, 12, EDificuldadeTarefa.MEDIA),
  );
  studyRoutine.adicionarTarefa(
    new Tarefa('Revisar Padroes de Design', 'Estudar Factory, State e Strategy', 50, 25, EDificuldadeTarefa.DIFICIL),
  );

  const healthRoutine = new Rotina('Saude Fisica', 'Saude', 'Exercicio e bem-estar', EFrequencia.DIARIA);
  const healthTask1 = new Tarefa(
    'Alongamento matinal',
    '15 minutos de alongamento',
    10,
    5,
    EDificuldadeTarefa.FACIL,
  );
  const healthTask2 = new Tarefa('Cardio 20 min', 'Corrida, bicicleta ou natacao', 20, 10, EDificuldadeTarefa.MEDIA);
  const healthTask3 = new Tarefa('Meditacao', '10 minutos de meditacao', 15, 8, EDificuldadeTarefa.FACIL);
  healthRoutine.adicionarTarefa(healthTask1);
  healthRoutine.adicionarTarefa(healthTask2);
  healthRoutine.adicionarTarefa(healthTask3);

  const readingRoutine = new Rotina(
    'Leitura Diaria',
    'Leitura',
    'Desenvolvimento pessoal e conhecimento',
    EFrequencia.DIARIA,
  );
  const readingTask1 = new Tarefa('Ler 20 paginas', 'Livro de desenvolvimento', 25, 12, EDificuldadeTarefa.MEDIA);
  const readingTask2 = new Tarefa('Ler artigos tech', 'Dev.to ou Medium', 15, 8, EDificuldadeTarefa.FACIL);
  readingRoutine.adicionarTarefa(readingTask1);
  readingRoutine.adicionarTarefa(readingTask2);

  user.adicionarRotina(studyRoutine);
  user.adicionarRotina(healthRoutine);
  user.adicionarRotina(readingRoutine);

  const studyTask1 = studyRoutine.getTarefas()[0];
  if (studyTask1) {
    studyTask1.iniciar();
  }
  healthTask1.concluir();
  readingTask1.concluir();
  user.adicionarXP(100, 'Seed initial XP');

  return user;
}
