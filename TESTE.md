# 🧪 Guia de Teste - Flow PWA

## 🎯 Como testar o fluxo completo

### Pré-requisitos
- Servidor rodando: `npm run dev`
- Navegador: Chrome, Firefox ou Safari
- URL: `http://localhost:3000`

---

## 📋 Checklist de Testes

### 1. Onboarding (Primeira execução)
1. Acesse `http://localhost:3000`
2. Deve aparecer a tela de onboarding com:
   - Ícone 🌊
   - Título "Flow"
   - 4 macroprocessos explicados
   - Botão "Começar agora"
3. Clique em "Começar agora"
4. Aguarde seed do Rafael ser criado
5. Deve redirecionar para `/checkin/morning`

**✅ Resultado esperado:** Usuário e hábitos criados no IndexedDB

---

### 2. Check-in Matinal
1. **Step 1 - Emoção e Inputs:**
   - Escolha uma emoção (ex: 😊)
   - Ajuste sliders:
     - Energia: 7/10
     - Calma: 8/10
     - Sono: 4/5
   - Clique "Continuar"

2. **Step 2 - Modo do Dia:**
   - Deve calcular automaticamente (ex: "Modo Foco ⚙️")
   - Exibe descrição e sugestões
   - Clique "Definir prioridades"

3. **Step 3 - Top 3:**
   - Digite 3 prioridades (ex: "Implementar login", "Revisar PRD", "Estudar TypeScript")
   - Clique "Começar o dia"

**✅ Resultado esperado:** Redirecionado para `/home` com dados salvos

---

### 3. Home (Dashboard)
1. Verifique elementos na tela:
   - Card do Modo do Dia (cor correspondente)
   - Contador de microvitórias (0)
   - Barra de progresso (0%)
   - Top 3 prioridades listadas
   - Hábitos do dia (filtrados por frequência)
   - 4 botões de navegação

2. **Testar interações:**
   - Marque 1 prioridade do Top 3 (deve ficar verde e riscada)
   - Microvitórias deve aumentar para 1
   - Barra de progresso deve atualizar
   - Marque 1 hábito (ex: "Meditação matinal")
   - Microvitórias deve aumentar para 2

**✅ Resultado esperado:** Estado sincronizado com IndexedDB

---

### 4. Modo Foco (Pomodoro)
1. Clique no botão "Foco ⚙️" na Home
2. Na tela do Pomodoro:
   - Digite intenção (ex: "Revisar código")
   - Clique "Começar"
   - Timer deve iniciar (25:00)
   - Progress ring deve animar
3. Teste botão "Pausar"
4. Teste botão "Reiniciar"

**✅ Resultado esperado:** Timer funcional com estados corretos

---

### 5. Ritual de Descompressão
1. Volte para Home
2. Clique no botão "Desligar 🌇"
3. Na tela de descompressão:
   - Deve exibir atividade aleatória (ex: "Respiração consciente")
   - Frase empática automática
   - Resumo do dia (Top 3, hábitos, microvitórias)
4. Clique "Trocar sugestão" (deve mudar atividade)
5. Clique "Vou fazer essa atividade"
6. Deve exibir confirmação verde

**✅ Resultado esperado:** Atividade salva em `daily_state.relaxActivity`

---

### 6. Check-in Final (Relaxar)
1. Volte para Home
2. Clique no botão "Relaxar 🌙"
3. **Step 1 - Journaling:**
   - Escreva algo (ex: "Hoje consegui focar bem nas tarefas")
   - Clique "Continuar"

4. **Step 2 - Check-in Final:**
   - Escolha emoção
   - Ajuste sliders (energia e calma)
   - Clique "Finalizar dia"

5. **Step 3 - Insight:**
   - Deve exibir insight automático gerado
   - Frase empática contextual
   - Métricas do dia (energia, calma, vitórias)

**✅ Resultado esperado:** Insight salvo no IndexedDB

---

### 7. Painel de Insights
1. Clique no botão "Insights 📊" na Home
2. Verifique elementos:
   - 3 cards de métricas principais
   - Curva semanal (energia × calma)
   - Histórico de insights
   - Palavras frequentes (se houver journaling)

**✅ Resultado esperado:** Dados dos últimos 7 dias visualizados

---

## 🔍 Testes de Persistência

### Teste 1: Reload da página
1. Complete um ciclo completo (manhã → noite)
2. Pressione F5 para recarregar
3. Acesse `/home`

**✅ Resultado esperado:** Todos os dados permanecem (Top 3, hábitos, microvitórias)

### Teste 2: Fechar e abrir navegador
1. Complete um ciclo
2. Feche o navegador completamente
3. Reabra e acesse `http://localhost:3000`

**✅ Resultado esperado:** Redireciona para `/home` (não mostra onboarding)

### Teste 3: Novo dia
1. Altere a data do sistema para o dia seguinte
2. Acesse `http://localhost:3000`

**✅ Resultado esperado:** Deve redirecionar para `/checkin/morning` (novo dia)

---

## 🌐 Testes Offline

### Teste 1: Service Worker
1. Abra DevTools (F12)
2. Vá para Application → Service Workers
3. Deve ver "flow-v1" registrado e ativo

### Teste 2: Funcionamento offline
1. Com app aberto, vá para DevTools
2. Application → Service Workers → Check "Offline"
3. Recarregue a página (F5)

**✅ Resultado esperado:** App continua funcionando normalmente

### Teste 3: Cache
1. DevTools → Application → Cache Storage
2. Deve ver "flow-static-v1" e "flow-v1"
3. Verifique arquivos cacheados

---

## 📱 Teste de PWA (Instalação)

### Chrome Desktop
1. Clique no ícone de instalação na barra de endereço (⊕)
2. Clique "Instalar"
3. App deve abrir em janela standalone
4. Feche e reabra pelo menu iniciar

### Chrome Mobile
1. Acesse pelo celular (usar ngrok ou similar)
2. Menu → "Adicionar à tela inicial"
3. App deve abrir em fullscreen

**✅ Resultado esperado:** App instalável e funciona como nativo

---

## 🐛 Testes de Edge Cases

### 1. Top 3 vazio
- Tente finalizar check-in matinal sem preencher nenhuma prioridade
- **Esperado:** Alerta "Adicione pelo menos uma prioridade"

### 2. Emoção não selecionada
- Tente avançar step 1 sem escolher emoção
- **Esperado:** Alerta "Escolha uma emoção"

### 3. Journaling vazio
- Tente avançar sem escrever nada no journaling
- **Esperado:** Alerta "Escreva pelo menos uma frase"

### 4. Navegação direta
- Acesse `/home` sem fazer onboarding
- **Esperado:** Redirecionamento automático para `/onboarding`

---

## 🎨 Testes de UI/UX

### Responsividade
1. Abra DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Teste em resoluções:
   - Mobile: 375x667
   - Tablet: 768x1024
   - Desktop: 1440x900

**✅ Resultado esperado:** Layout adaptável em todas as resoluções

### Animações
1. Observe transições entre páginas
2. Efeitos de hover nos botões
3. Progress bars animadas
4. Escalas nos elementos selecionados

**✅ Resultado esperado:** Animações suaves (0.3-0.6s)

### Acessibilidade
1. Navegue usando apenas Tab
2. Teste com leitor de tela (opcional)
3. Verifique contraste de cores

---

## 📊 Inspeção do IndexedDB

### Chrome DevTools
1. F12 → Application → IndexedDB
2. Expanda "flow-db"
3. Verifique stores:
   - **users**: 1 registro (Rafael)
   - **habits**: 6 registros
   - **checkins**: 1+ registros (manhã/noite)
   - **dailyStates**: 1 registro (dia atual)
   - **insights**: 1+ registros

---

## ✅ Critérios de Sucesso

- [ ] Onboarding completo sem erros
- [ ] Check-in matinal salva dados corretamente
- [ ] Modo do Dia calculado automaticamente
- [ ] Home exibe e atualiza estado em tempo real
- [ ] Timer Pomodoro funcional
- [ ] Ritual de descompressão sorteia atividades
- [ ] Check-in noturno gera insight
- [ ] Painel de insights exibe curvas
- [ ] Dados persistem após reload
- [ ] App funciona 100% offline
- [ ] Service Worker registrado
- [ ] PWA instalável
- [ ] UI responsiva em mobile
- [ ] Animações suaves

---

## 🚨 Problemas Comuns

### "Failed to fetch"
**Causa:** Service Worker tentando cachear recursos inexistentes
**Solução:** Limpar cache (DevTools → Application → Clear Storage)

### IndexedDB não abre
**Causa:** Modo anônimo ativado
**Solução:** Usar janela normal do navegador

### Animações travando
**Causa:** Hardware aceleração desabilitada
**Solução:** Habilitar em chrome://flags

---

## 📝 Relatório de Teste

Após testar, preencha:

```
Data do Teste: __/__/____
Navegador: ______________
Sistema: ______________

✅ Funcionalidades OK:
- [ ] Onboarding
- [ ] Check-in Matinal
- [ ] Home
- [ ] Foco
- [ ] Descompressão
- [ ] Check-in Final
- [ ] Insights
- [ ] PWA

❌ Bugs encontrados:
1. _______________________
2. _______________________

💡 Sugestões de melhoria:
1. _______________________
2. _______________________
```

---

**Bons testes! 🧪**
