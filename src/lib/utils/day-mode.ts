import { DayMode } from '../db/types'

interface MorningCheckInData {
  energy: number // 0-10
  calm: number // 0-10
  sleepQuality: number // 1-5
}

/**
 * Algoritmo para determinar o Modo do Dia baseado nos inputs matinais
 *
 * Lógica:
 * - CALMA (🌿): energia média-baixa + calma alta + sono bom
 * - FOCO (⚙️): energia alta + calma média-alta + sono bom
 * - CONEXÃO (💬): energia média + calma média + sono ok
 * - RECUPERAR (🌧️): energia baixa OU calma baixa OU sono ruim
 */
export function calculateDayMode(data: MorningCheckInData): DayMode {
  const { energy, calm, sleepQuality } = data

  // Normalizar sono de 1-5 para 0-10
  const sleepNormalized = (sleepQuality - 1) * 2.5

  // RECUPERAR: condições ruins
  if (energy <= 3 || calm <= 3 || sleepQuality <= 2) {
    return 'recover'
  }

  // FOCO: alta energia + calma razoável + sono bom
  if (energy >= 7 && calm >= 5 && sleepQuality >= 4) {
    return 'focus'
  }

  // CALMA: energia moderada + alta calma
  if (energy >= 4 && energy <= 7 && calm >= 7) {
    return 'calm'
  }

  // CONEXÃO: valores moderados em geral
  if (energy >= 4 && calm >= 4) {
    return 'connect'
  }

  // Default: recuperar
  return 'recover'
}

export function getModeConfig(mode: DayMode) {
  const configs = {
    calm: {
      emoji: '🌿',
      label: 'Calma',
      color: 'blue',
      description: 'Dia para fluir com leveza e contemplação',
      suggestions: [
        'Priorize tarefas criativas',
        'Reserve tempo para reflexão',
        'Mantenha ritmo tranquilo',
      ],
    },
    focus: {
      emoji: '⚙️',
      label: 'Foco',
      color: 'yellow',
      description: 'Energia alta para tarefas importantes',
      suggestions: [
        'Ataque as tarefas mais difíceis',
        'Use técnica Pomodoro',
        'Minimize distrações',
      ],
    },
    connect: {
      emoji: '💬',
      label: 'Conexão',
      color: 'green',
      description: 'Dia para interações e colaboração',
      suggestions: [
        'Agende reuniões importantes',
        'Fortaleça relações',
        'Trabalhe em equipe',
      ],
    },
    recover: {
      emoji: '🌧️',
      label: 'Recuperar',
      color: 'purple',
      description: 'Momento de cuidado e descanso',
      suggestions: [
        'Reduza expectativas',
        'Priorize autocuidado',
        'Tarefas simples e leves',
      ],
    },
  }

  return configs[mode]
}
