# /pr — Criar Pull Request automático


## Objetivo
Gerar o **título, descrição e checklist** do PR, e preparar a abertura do PR.


## Ferramentas MCP a usar (antes de montar o PR)
- **git.summary**: últimos 10 commits + diff resumido entre base e HEAD.
- **process.exec**:
- `pnpm vitest --run`
- `pnpm cypress run --quiet` (se existir `cypress/`)
- *(opcional)* **process.exec** com GitHub CLI:
- `gh pr create -B develop -t "feat: <feature> — <benefício>" -F pr.md`
- Se sem `gh`, apenas gerar corpo do PR e instruções.


## Template de Pull Request


**Título:**
```text
feat: <feature> — <benefício para o usuário>
Descrição (executivo):
### Contexto
Breve explicação do problema ou PRD relacionado.


### O que foi implementado
- Bullet 1
- Bullet 2
- Bullet 3


### Riscos / Rollbacks
- Risco 1
- Risco 2


### Evidências
- Cobertura: <colar resumo do Vitest>
- E2E: <colar resumo do Cypress>
- Screenshots/GIFs (opcional)

### ✅ Checklist de Qualidade
- [ ] Testes unitários e E2E passando
- [ ] Acessibilidade e responsividade revisadas
- [ ] Limite de 3 arquivos por comando respeitado
- [ ] Decisões de design e copy explicadas nos commits
- [ ] Nenhuma dependência nova sem justificativa

### Comandos Git sugeridos (se necessário)
# Criar branch
git checkout -b feat/<slug>


# Commitar tudo
git add -A && git commit -m "feat: <slug> – implementação inicial"


# Subir branch
git push -u origin feat/<slug>


# Abrir PR via gh CLI (opcional)
gh pr create -B develop -t "feat: <feature> — <benefício>" -F pr.md
```
