export function createMockAchievements() {
  return [
    {
      id: 'ach-1',
      name: 'Primeira Tarefa',
      description: 'Complete sua primeira tarefa',
      icon: '🎯',
      rarity: 'common',
      unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-2',
      name: 'Streak de 7 Dias',
      description: 'Mantenha a rotina por 7 dias consecutivos',
      icon: '🔥',
      rarity: 'rare',
      unlockedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ach-3',
      name: 'Colecionador',
      description: 'Compre 5 itens na loja',
      icon: '🎁',
      rarity: 'rare',
      progress: 1,
      target: 5,
    },
    {
      id: 'ach-4',
      name: 'Mestre da Produtividade',
      description: 'Complete 100 tarefas',
      icon: '👑',
      rarity: 'epic',
      progress: 15,
      target: 100,
    },
    {
      id: 'ach-5',
      name: 'Lendario',
      description: 'Chegue ao nivel 50',
      icon: '⭐',
      rarity: 'legendary',
      progress: 5,
      target: 50,
    },
  ];
}

export function createMockHistoryItems() {
  return [
    {
      id: '1',
      type: 'purchase',
      title: 'Avatar Epico',
      description: 'Comprado na loja',
      icon: '🎨',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      details: '1000 moedas',
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Streak de 7 Dias',
      description: 'Achievement desbloqueado',
      icon: '🔥',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      details: '+100 XP',
    },
    {
      id: '3',
      type: 'level-up',
      title: 'Level Up!',
      description: 'Subiu para o nivel 5',
      icon: '⭐',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      details: 'Nivel 5',
    },
    {
      id: '4',
      type: 'purchase',
      title: 'Tema Escuro',
      description: 'Comprado na loja',
      icon: '🌙',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      details: '500 moedas',
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Primeira Tarefa',
      description: 'Achievement desbloqueado',
      icon: '🎯',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      details: '+50 XP',
    },
  ];
}

export function createMockProfileStats() {
  return {
    totalXpEarned: 450,
    totalCoinsEarned: 120,
    totalCoinsSpent: 60,
    routinesCreated: 3,
    routinesCompleted: 2,
    tasksCompleted: 8,
    currentStreak: 3,
    longestStreak: 7,
    daysSinceStart: 30,
  };
}

export function createMockMemberSinceDate(): Date {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

export function generateMockActivityHistory() {
  const days = [];
  const today = new Date();

  for (let index = 89; index >= 0; index--) {
    const date = new Date(today);
    date.setDate(date.getDate() - index);
    days.push({
      date,
      completed: Math.random() > 0.6,
    });
  }

  return days;
}
