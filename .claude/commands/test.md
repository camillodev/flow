# /test — Gerar testes a partir do PRD + commits recentes (TDD)


## Objetivo
Ler rapidamente o contexto do projeto e **escrever testes primeiro** (unit + e2e quando fizer sentido) para a próxima tarefa/feature.


## Ferramentas MCP a usar (ordem e parcimônia)
1) **git.listChangedFiles** (base=HEAD~5) e **git.diffShort** para escopo -> reduzir leitura.
2) **git.log** (n=5) para contexto dos últimos commits.
3) **fs.readFiles** apenas dos documentos essenciais (trechos relevantes):
- `/docs/prd.md`
- `/docs/spec.md`
- `/CLAUDE.MD` (somente regras/limites)
4) **process.exec** (checagens rápidas):
- `pnpm vitest --passWithNoTests`
- `pnpm cypress verify` (se Cypress estiver instalado)


## Regras
- TDD: gerar testes que **falham** antes de implementar.
- Máximo **3 arquivos modificados** neste comando (preferir criar/editar em `test/` e `cypress/`).
- Saída em **diff unificado (patch)** + **resumo curto** do porquê dos testes.
- Não implemente a feature aqui.


## Passos
1) Extraia **user stories** e **critérios de aceitação** do PRD/spec (cite o trecho).
2) Mapeie **unidades** (funções/hooks/serviços) e **fluxos e2e** afetados.
3) Gere:
- **Unit tests** (Vitest + Testing Library) cobrindo regras de negócio.
- **Component tests** se houver UI crítica.
- **E2E (Cypress)**: caminho feliz + principal erro.
4) Explique **o que deve falhar** agora e por quê.
5) Emita **patches**:
- novos arquivos em `test/` (ex.: `feature-name.spec.ts`)
- novos specs E2E em `cypress/e2e/` (ex.: `feature-name.cy.ts`)
- ajustes mínimos de config (`vitest.config.ts`, `cypress.config.ts`) se necessário.


## Convenções
- Nomes: `feature-name.spec.ts` (unit), `feature-name.cy.ts` (e2e).
- Coverage alvo inicial: **linhas ≥ 70%** no escopo tocado.
- Evite mocks caros; preferir **contracts leves**.


## Formato de resposta
1) **Plano em bullets (≤ 12 linhas)**
2) **Patches git** (unificados)
3) **Comandos para rodar localmente**: `pnpm test`, `pnpm e2e`