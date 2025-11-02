# 🧠 CLAUDE.md — Project Memory (flow)

## ⚙️ Commands
- **Dev:** `pnpm dev`
- **Test:** `pnpm test`
- **Lint:** `pnpm lint`
- **Format:** `pnpm format`
- **Build:** `pnpm build`
- **Deploy:** `vercel --prod`
- **Database:** `pnpm db:push` | `pnpm db:studio`

## 🧩 Tech Stack
- **Framework:** Next.js + TypeScript
- **UI:** React + Tailwind CSS
- **State Management:** Zustand
- **Database:** Supabase
- **Infra:** Vercel (frontend) + Supabase (backend)
- **Testing:** Vitest + Playwright (E2E)
- **AI Tools:** Claude Code (agente CLI) + Cursor (IDE visual)

---

## 🎨 UX & UI Heuristics
> Baseado em Nielsen Norman Group + Growth Design heuristics

- **Clareza antes de estética** — *"funciona > bonito > encantador."*
- **Feedback imediato:** cada ação deve gerar resposta visual (loading, confirmação, erro)
- **Reduzir esforço cognitivo** — agrupar funções relacionadas, usar nomes simples
- **Consistência visual:** espaçamentos base de Tailwind `p-4`, `gap-4`, `rounded-2xl`
- **Hierarquia visual clara:** *headline > benefício > CTA*
- **Design mobile-first:** otimizar para viewport 375px–1440px
- **Acessibilidade (A11y):** contrastes altos, alt texts, ARIA roles
- **Componentes reutilizáveis:** semanticamente corretos (`<button>`, `<label>`)

---

## ✍️ Copywriting & Marketing Principles
> Claude deve escrever textos com propósito de conversão

- **Foco no benefício**, não na feature  
  Ex: "Valide sua ideia em minutos" > "Crie landing pages com IA"
- **Linguagem natural:** 7º ano de leitura, tom confiante e empático
- **Headlines:** até 60 caracteres, verbo forte no início
- **CTA direto e claro:** "Começar agora", "Testar grátis", "Gerar página"
- **Evitar jargão técnico** ou inglês desnecessário
- **Cada tela deve responder:** *"O que é? Como funciona? Por que me importo?"*
- **Toda página tem objetivo** (signup, lead, conversão) → não gerar telas "decorativas"

---

## 💻 Frontend Patterns (Next.js + Tailwind + Zustand)

### Estrutura base
```
/src
  /app
  /components
  /store
  /hooks
  /lib
```

### Zustand store
```ts
import { create } from 'zustand'

interface LaunchState {
  pages: number
  setPages: (v: number) => void
}

export const useLaunch = create<LaunchState>((set) => ({
  pages: 0,
  setPages: (v) => set({ pages: v }),
}))
```

### Tailwind Guidelines
- Sempre usar classes utilitárias padronizadas (`flex`, `gap-4`, `rounded-2xl`, `shadow-sm`)
- Evitar CSS customizado se possível
- Componentes devem ser acessíveis e responsivos sem media queries manuais
- Use HeadlessUI ou Radix para interações complexas (modais, dropdowns)

---

## 🚫 Proibições

- ❌ Não editar `/dist`, `/out` ou arquivos gerados automaticamente
- ❌ Não commitar `.env` ou chaves privadas
- ❌ Não alterar testes sem motivo técnico documentado
- ❌ Não gerar código sem PRD validado
- ❌ Não escrever texto de marketing sem CTA claro

---

## 🌿 Branches

- **main:** produção
- **develop:** integração contínua
- **feat/\<nome>:** novas features
- **fix/\<bug>:** correções
- **refactor/\<escopo>:** melhorias sem mudar comportamento
- **chore/\<tarefa>:** docs, configs, build

---

## 💬 Convenções de Commit

- **feat:** nova feature
- **fix:** correção de bug
- **test:** adição/alteração de testes
- **refactor:** melhoria estrutural sem mudar lógica
- **chore:** manutenção
- **docs:** documentação
- **style:** formatação sem alteração funcional

---

## 🧠 Regras de Contexto (Claude Code)

- Antes de gerar código, ler `/docs/spec.md` e `/docs/prd.md`
- Aplicar TDD: gerar testes que falham → implementar → validar
- Responder com plano antes de editar muitos arquivos
- Limitar mudanças a 3 arquivos por comando
- Sempre explicar decisão de design, UX, ou copywriting nos commits
- Se encontrar ambiguidade → sugerir pergunta no PRD antes de continuar

---

## 🧭 Referências de Qualidade

- Nielsen Norman Group – 10 Heuristics for UX
- Tailwind UI Guidelines
- Zustand Docs
- Good Copy – Marketing Swipe File
- [Rafael Camillo AI Pattern: PRD + TDD + UX Heuristics]