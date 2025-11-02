# 🌊 Flow - Copiloto de Bem-Estar

PWA offline-first que ajuda a manter ritmo, constância e estabilidade emocional ao longo do dia.

## 🎯 Funcionalidades

### 4 Macroprocessos

1. **Acordar 🕊️** - Check-in matinal com definição do Modo do Dia
2. **Foco ⚙️** - Timer Pomodoro e gestão de prioridades
3. **Desligar 🌇** - Ritual de descompressão com atividades substitutivas
4. **Relaxar 🌙** - Journaling e insights automáticos

### Principais Features

- ✅ Check-ins matinais e noturnos estruturados
- ✅ Algoritmo de detecção automática do "Modo do Dia" (Calma, Foco, Conexão, Recuperar)
- ✅ Top 3 prioridades diárias
- ✅ Gestão de hábitos com tracking
- ✅ Ritual de descompressão com 12 atividades substitutivas
- ✅ Timer Pomodoro para foco
- ✅ Geração automática de insights diários
- ✅ Painel com curvas de energia e calma (7 dias)
- ✅ Feedback empático em cada etapa
- ✅ 100% offline com IndexedDB
- ✅ PWA instalável

## 🛠️ Tech Stack

- **Framework:** Next.js 14 + TypeScript
- **UI:** React + Tailwind CSS
- **Animações:** Framer Motion
- **Persistência:** IndexedDB (idb)
- **PWA:** Service Worker + Manifest
- **Testing:** Vitest + Playwright

## 🚀 Começar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes
npm test
```

## 📁 Estrutura

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── page.tsx           # Entry point (redirect)
│   ├── onboarding/        # Setup inicial
│   ├── checkin/morning/   # Check-in matinal
│   ├── home/              # Dashboard principal
│   ├── focus/             # Timer Pomodoro
│   ├── decompress/        # Ritual de descompressão
│   ├── relax/             # Check-in noturno + journaling
│   └── insights/          # Painel de métricas
├── lib/
│   ├── db/                # IndexedDB (schema, types, seed)
│   ├── utils/             # Algoritmos (modo do dia, insights)
│   └── data/              # JSON de atividades
└── public/
    ├── manifest.json      # PWA manifest
    ├── sw.js             # Service Worker
    └── icon.svg          # Ícone do app
```

## 🧠 Algoritmo do Modo do Dia

Baseado em 3 inputs matinais:
- **Energia** (0-10)
- **Calma** (0-10)
- **Qualidade do sono** (1-5)

Calcula automaticamente:
- 🌿 **Calma**: energia média-baixa + calma alta
- ⚙️ **Foco**: energia alta + calma razoável
- 💬 **Conexão**: valores moderados
- 🌧️ **Recuperar**: condições ruins

## 📊 Persistência de Dados

Todas as informações ficam localmente no dispositivo via IndexedDB:

- **users**: perfil do usuário
- **habits**: hábitos configurados
- **checkins**: check-ins matinais e noturnos
- **dailyStates**: estado diário (Top 3, modo, progresso)
- **insights**: insights gerados automaticamente

## 🎨 Design System

### Cores por Modo

- 🌿 Calma → Azul claro
- ⚙️ Foco → Dourado
- 💬 Conexão → Verde
- 🌧️ Recuperar → Lilás

### Princípios UX

- Clareza antes de estética
- Feedback imediato em cada ação
- Hierarquia visual clara
- Mobile-first (375px-1440px)
- Animações suaves (0.3-0.6s)

## ✅ Critérios de Validação

- [x] Usuário completa ciclo completo (manhã → noite) com persistência
- [x] App sugere atividade substitutiva automaticamente
- [x] Feedbacks empáticos aparecem naturalmente
- [x] PWA funciona 100% offline
- [x] Interface calma, limpa e responsiva

## 📝 Próximos Passos

- [ ] Gerar ícones PNG otimizados (192x192, 512x512)
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar notificações push (opcional)
- [ ] Exportar dados como JSON
- [ ] Dark mode

## 👨‍💻 Desenvolvido para

Rafael Camillo (TDAH + TEA leve)

---

**Versão:** 1.0.0
**Status:** MVP completo
