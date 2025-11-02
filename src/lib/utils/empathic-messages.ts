/**
 * Frases empáticas para feedback ao completar tarefas
 */
export const empatheticMessages = [
  'Você está cuidando de si 🌿',
  'Pequenos passos contam muito',
  'Hoje você fez o suficiente',
  'Orgulho silencioso é o mais forte',
  'Cada vitória merece ser celebrada',
  'Você está progredindo',
  'Isso é autocuidado em ação',
  'Constância importa mais que perfeição',
  'Você está honrando seus limites',
  'Pequenas ações, grande impacto',
  'Você merece esse momento',
  'Está indo bem no seu ritmo',
]

export function getRandomEmpatheticMessage(): string {
  return empatheticMessages[Math.floor(Math.random() * empatheticMessages.length)]
}

/**
 * Labels para emojis de emoção
 */
export const emotionLabels: Record<string, string> = {
  '😊': 'Animado',
  '😌': 'Tranquilo',
  '😐': 'Neutro',
  '😔': 'Triste',
  '😤': 'Irritado',
  '😴': 'Sonolento',
  '🤔': 'Pensativo',
  '😰': 'Ansioso',
}

/**
 * Rótulos dinâmicos para sliders
 */
export function getEnergyLabel(value: number): string {
  if (value <= 3) return 'Baixa'
  if (value <= 6) return 'Média'
  return 'Alta'
}

export function getCalmLabel(value: number): string {
  if (value <= 3) return 'Tensa'
  if (value <= 6) return 'Estável'
  return 'Serena'
}

export function getSleepLabel(value: number): string {
  const labels = ['', 'Péssimo', 'Fraco', 'Ok', 'Bom', 'Ótimo']
  return labels[value] || ''
}

/**
 * Gera resumo emocional da semana
 */
export function generateWeeklySummary(
  avgEnergy: number,
  avgCalm: number,
  energyVariation: number
): string {
  let summary = ''

  // Análise de calma
  if (avgCalm >= 7) {
    summary += 'Semana tranquila'
  } else if (avgCalm >= 5) {
    summary += 'Semana moderada'
  } else {
    summary += 'Semana agitada'
  }

  // Análise de energia
  if (energyVariation > 3) {
    summary += ', mas energia irregular.'
  } else if (avgEnergy >= 7) {
    summary += ' com energia consistente.'
  } else if (avgEnergy <= 4) {
    summary += ' com energia baixa.'
  } else {
    summary += ' com energia equilibrada.'
  }

  // Sugestão
  if (avgCalm < 5) {
    summary += ' Foque em práticas de calma.'
  } else if (avgEnergy < 5) {
    summary += ' Priorize descanso e recuperação.'
  } else {
    summary += ' Continue cuidando do equilíbrio.'
  }

  return summary
}
