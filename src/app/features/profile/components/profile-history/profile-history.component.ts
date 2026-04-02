import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Histórico de item
 */
export interface HistoryItem {
  id: string;
  type: 'purchase' | 'achievement' | 'level-up';
  title: string;
  description: string;
  icon: string;
  date: Date;
  details?: string;
}

/**
 * ProfileHistoryComponent: Histórico de compras e atividades
 */
@Component({
  selector: 'app-profile-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-history.component.html',
  styleUrl: './profile-history.component.scss',
})
export class ProfileHistoryComponent {
  // Mock data do histórico
  historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'purchase',
      title: 'Avatar Épico',
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
      description: 'Subiu para o nível 5',
      icon: '⭐',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      details: 'Nível 5',
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

  /**
   * Formatar data
   */
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  /**
   * Obter cor por tipo de item
   */
  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      purchase: '#667eea',
      achievement: '#ffd700',
      'level-up': '#ff6b6b',
    };
    return colors[type] || '#888';
  }

  /**
   * Traduzir tipo
   */
  translateType(type: string): string {
    const translations: Record<string, string> = {
      purchase: 'Compra',
      achievement: 'Achievement',
      'level-up': 'Level Up',
    };
    return translations[type] || type;
  }
}
