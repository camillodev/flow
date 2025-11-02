import type { CheckIn, DailyState, Insight } from '../db/types'

/**
 * Gera insight automático baseado nos dados do dia
 */
export function generateDailyInsight(
  morningCheckIn: CheckIn,
  eveningCheckIn: CheckIn,
  dailyState: DailyState
): Insight {
  const { energy: morningEnergy, calm: morningCalm } = morningCheckIn
  const { energy: eveningEnergy, calm: eveningCalm } = eveningCheckIn

  const energyDelta = eveningEnergy - morningEnergy
  const calmDelta = eveningCalm - morningCalm

  const tasksCompleted = dailyState.top3Completed.filter(Boolean).length
  const taskCompletionRate = (tasksCompleted / dailyState.top3.length) * 100

  let content = ''

  // Análise de energia
  if (energyDelta > 2) {
    content += 'Sua energia aumentou ao longo do dia. '
  } else if (energyDelta < -2) {
    content += 'Você terminou o dia mais cansado. Isso é normal. '
  } else {
    content += 'Sua energia se manteve estável. '
  }

  // Análise de calma
  if (calmDelta > 2) {
    content += 'Você conseguiu aumentar sua calma. '
  } else if (calmDelta < -2) {
    content += 'O dia foi agitado, mas você chegou até aqui. '
  }

  // Análise de tarefas
  if (taskCompletionRate >= 100) {
    content += 'Você completou todas as prioridades! '
  } else if (taskCompletionRate >= 66) {
    content += 'Bom progresso nas suas prioridades. '
  } else if (taskCompletionRate >= 33) {
    content += 'Algumas prioridades ficaram para trás, mas tudo bem. '
  } else {
    content += 'Foi um dia difícil para focar, mas você tentou. '
  }

  // Microvitórias
  if (dailyState.microwins >= 5) {
    content += 'Celebre suas microvitórias! '
  }

  // Mensagem final
  content += 'Amanhã é um novo dia.'

  const insight: Insight = {
    id: `insight-${Date.now()}`,
    userId: 'rafael',
    date: dailyState.date,
    type: 'daily',
    content,
    metrics: {
      avgEnergy: (morningEnergy + eveningEnergy) / 2,
      avgCalm: (morningCalm + eveningCalm) / 2,
      habitStreak: dailyState.habitsCompleted.length,
      microwins: dailyState.microwins,
    },
    createdAt: new Date().toISOString(),
  }

  return insight
}

/**
 * Frases empáticas baseadas no estado emocional
 */
export function getEmpathicPhrase(energy: number, calm: number): string {
  if (energy <= 3 && calm <= 3) {
    return 'Dias difíceis fazem parte. Você não está sozinho.'
  }

  if (energy >= 8 && calm >= 8) {
    return 'Que dia incrível! Aproveite essa sensação.'
  }

  if (energy <= 4 && calm >= 7) {
    return 'Cansado mas calmo. Respeite seu ritmo.'
  }

  if (energy >= 7 && calm <= 4) {
    return 'Muita energia, mas agitado. Hora de desacelerar.'
  }

  return 'Você fez o seu melhor hoje. Isso é o que importa.'
}
