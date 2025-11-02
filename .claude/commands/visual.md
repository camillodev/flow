# /visual — QA visual iterativo até boa UX


## Objetivo
Polir UX/UI do fluxo alterado, aplicando heurísticas (clareza, feedback, mobile-first, A11y, hierarquia, espaçamento Tailwind).


## Ferramentas MCP a usar
- **process.exec**:
- `pnpm cypress run --quiet` (E2E) ou `pnpm cypress run --component` se usar CT
- **git.diffShort** para focar só nos componentes tocados.
- **fs.readFiles** dos componentes e estilos envolvidos.
- *(opcional)* Integração Figma via MCP se configurada (comparação textual de rótulos/spacing).


## Passos
1) Rode os testes e colete **erros visuais**/flakiness.
2) Check-list heurístico (marcar ok/falta):
- Semântica (botões/links, aria-*)
- Feedback de estado (loading/erro/sucesso)
- Hierarquia (títulos, contraste, espaçamentos)
- Responsividade (sm/md/lg)
- Ações críticas com foco/teclado
3) Proponha **micro-ajustes** (classe Tailwind, aria-*, copy) em no máx **3 arquivos**.
4) Emita patch incremental.
5) Pergunte se deseja mais uma rodada.


## Formato de resposta
- **Checklist** com 6–10 itens.
- **Patch git** enxuto (apenas UI/copy leve).
- **Antes/Depois** (2–4 bullets).