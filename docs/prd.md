# 🌊 PRD — Flow (Rafael)
**Versão:** 1.1  
**Tipo:** PWA offline-first  
**Responsável:** Deschamps AI  
**Stack:** React + TypeScript + Vite + Tailwind + Framer Motion + IndexedDB  
**Usuário principal:** Rafael Camillo (TDAH + TEA leve)

---

## 🎯 1. Visão Geral
**Flow** é um **PWA offline-first** que ajuda **Rafael** a manter **ritmo, constância e estabilidade emocional** ao longo do dia.  
O app funciona como um **copiloto empático**, guiando-o por **microetapas previsíveis**, com **check-ins, prioridades, hábitos e rituais curtos**.

A experiência se estrutura em **4 macroprocessos**:

1. **Acordar** 🕊️ — regular energia e definir o clima do dia  
2. **Foco** ⚙️ — manter ritmo e propósito nas microtarefas  
3. **Desligar** 🌇 — transição saudável do trabalho  
4. **Relaxar** 🌙 — desacelerar corpo e mente  

O app reforça **autopercepção + leveza + previsibilidade**, sem uso de IA ou distrações externas.

---

## 🧠 2. Wireflow (Fluxo Visual das Telas)

### 🧩 Estrutura geral
```
App
 ├── Onboarding (1x) → Seed Rafael
 ├── Home
 │   ├── Top 3 do Dia
 │   ├── Hábitos do Dia (diários + semanais)
 │   ├── Barra de Progresso (% de microvitórias)
 │   ├── Modo do Dia (🌿 / ⚙️ / 💬 / 🌧️)
 │   └── Botões: Acordar | Foco | Desligar | Relaxar
 │
 ├── CheckIn Matinal
 │   ├── Emoção do dia (emoji picker)
 │   ├── Energia e Calma (sliders 0–10)
 │   ├── Qualidade do sono (1–5)
 │   └── Sugestão automática de Top 3 → Confirmar
 │
 ├── Foco
 │   ├── Timer Pomodoro (25/5)
 │   ├── Microchecklist de intenção (texto curto)
 │   ├── Microvitórias (🌱 animações)
 │   └── Frases empáticas automáticas
 │
 ├── Desligar
 │   ├── Resumo do dia (progresso hábitos e Top 3)
 │   ├── Ritual de Descompressão (atividade aleatória JSON)
 │   ├── Botão “Trocar sugestão”
 │   └── Confirmar atividade → feedback empático
 │
 ├── Relaxar
 │   ├── Respiração guiada (animação circular)
 │   ├── Journaling curto (“O que te fez bem hoje?”)
 │   ├── Check-in final (emoção + energia + calma)
 │   └── Insight automático para o próximo dia
 │
 └── Painel (Insights)
     ├── Curva Energia × Calma (últimos 7 dias)
     ├── Constância de Hábitos
     ├── Microvitórias totais 🌿
     └── Frases mais frequentes exibidas
```

### 🧭 Fluxo do usuário (macro)
```
CheckIn Matinal → Home (Modo do Dia) → Foco → Desligar (Atividade sugerida) → Relaxar (Journaling) → Insight → Home (dia seguinte)
```

---

## 🧩 3. Problema
Rafael vive ciclos de **hiperfoco e esgotamento**, alternando com **impulsos dopaminérgicos** (maconha, sexo, telas).  
Ele precisa de uma ferramenta simples, visual e offline que o ajude a:
- **Prever e estabilizar o dia**
- **Evitar impulsos de fim de expediente**
- **Celebrar pequenas vitórias**

---

## 💡 4. Solução
**Flow** cria um ambiente previsível e positivo:
- Check-ins estruturados (manhã/noite)  
- Prioridades curtas (Top 3)  
- Hábitos configuráveis (diários e semanais)  
- Ritual de Descompressão com **atividades substitutivas saudáveis**  
- Feedback empático com frases e emojis  

Tudo isso **offline**, com **persistência local via IndexedDB**.

---

## ⚙️ 5. Objetivos do Produto
| Tipo | Objetivo |
|------|-----------|
| Funcional | Oferecer um fluxo diário previsível com check-ins e rituais curtos. |
| Emocional | Reforçar constância, calma e empatia com frases automáticas. |
| Comportamental | Reduzir hábitos de dopamina rápida com rituais substitutivos. |
| Técnico | App 100% offline com persistência via IndexedDB. |

---

## 🎯 6. Roadmap de Implementação (Resumo)

### Etapa 1 — Base & IndexedDB
- Setup React + IndexedDB.
- Seed Rafael.
- Estrutura de dados principal.

### Etapa 2 — Check-in Matinal + Modo Automático
- Inputs: energia, calma, emoção, sono.
- Algoritmo define Modo do Dia.
- Sugere Top 3.

### Etapa 3 — Home, Top 3 & Hábitos do Dia
- Exibe prioridades e hábitos ativos.
- Barra de progresso + feedback visual.

### Etapa 4 — Ritual de Descompressão
- Exibir JSON de atividades.
- Botão “Trocar”.
- Salvar em `daily_state.relax_activity`.

### Etapa 5 — Check-in Final + Insight
- Journaling + resumo do dia.
- Geração de insight e curva semanal.

### Etapa 6 — Feedback & Animações
- Frases empáticas automáticas.
- Transições suaves (Framer Motion).

### Etapa 7 — Teste Offline
- Verificar cache e persistência completa.

---

## ✅ 7. Critérios de Validação
- Rafael conclui ciclo completo (manhã → noite) com dados persistentes.
- App sugere atividade substitutiva ao fim do trabalho.
- Feedbacks empáticos surgem naturalmente, sem IA.
- PWA funciona 100% offline.
- Interface calma, limpa e responsiva.

---

## 🎨 8. Identidade Visual
| Elemento | Estilo |
|-----------|---------|
| Tipografia | Inter / Nunito Sans |
| Cores | 🌿 Calma → azul-claro <br> ⚙️ Foco → dourado <br> 💬 Conexão → verde <br> 🌧️ Recuperar → lilás |
| Ícones | Emojis universais + ícones Lucide minimalistas |
| Animações | Suaves, 0.3–0.6s, Framer Motion |

---

## 🚀 9. Entregável Final
**App PWA “Flow”** — uma experiência empática, leve e funcional, que ajuda Rafael a navegar o dia com previsibilidade, autoconsciência e estabilidade emocional, **100% offline**, com **dados locais e feedback simbólico.**

