# /implement — Implementar o necessário para os testes passarem


## Objetivo
Com base nos testes existentes (que falham), implementar **o mínimo** para passar.


## Ferramentas MCP a usar
- **git.listChangedFiles** e **git.diffShort** para localizar o código sob teste.
- **fs.readFiles** somente dos componentes/serviços tocados e dos specs que falham.
- **process.exec** para ciclos curtos: `pnpm vitest --run` (ou `pnpm test:watch` quando interativo).


## Regras
- **Limitar mudanças a 3 arquivos** por execução (exceção: arquivos gerados automaticamente).
- Explicar **decisões de design/UX/copy** nos commits.
- Se houver ambiguidade no PRD, **sugerir pergunta** nos comentários do commit.


## Passos
1) Liste os **testes que falham** e o motivo (mensagens/expectativas).
2) Proponha **design simples** (funções/props/estado) apontando onde tocar.
3) Emita **patch** com implementação mínima.
4) Ajuste **tipos** e **acessibilidade** básica quando houver UI.
5) Execute via MCP `process.exec` o `pnpm vitest --run` e relate o status esperado.


## Formato de resposta
- **Resumo (≤ 8 linhas)**: o que mudou e por quê.
- **Patch git** unificado.
- **Nota de débito técnico** (se criada).