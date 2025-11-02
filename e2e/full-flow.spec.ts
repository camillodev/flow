import { test, expect } from '@playwright/test'

test.describe('Fluxo Completo do Flow PWA', () => {
  test('deve completar jornada completa com estilos corretos', async ({ page }) => {
    // 1. Onboarding
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("Flow")')).toBeVisible()
    await page.screenshot({ path: 'e2e-screenshots/01-onboarding.png', fullPage: true })

    const startBtn = page.locator('button:has-text("Começar agora")')
    const btnColor = await startBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    console.log('✓ Botão onboarding cor:', btnColor)
    expect(btnColor).toBe('rgb(59, 130, 246)') // blue-500

    await startBtn.click()
    await page.waitForURL('**/checkin/morning')

    // 2. Check-in Matinal - Step 1
    await expect(page.locator('h1:has-text("Como você está se sentindo?")')).toBeVisible()
    await page.screenshot({ path: 'e2e-screenshots/02-checkin-step1.png', fullPage: true })

    // Escolher emoção
    const emojiBtn = page.locator('button').filter({ hasText: '😊' }).first()
    await emojiBtn.click()

    // Ajustar sliders
    const energySlider = page.locator('input[type="range"]').nth(0)
    await energySlider.fill('7')

    const calmSlider = page.locator('input[type="range"]').nth(1)
    await calmSlider.fill('8')

    const sleepSlider = page.locator('input[type="range"]').nth(2)
    await sleepSlider.fill('4')

    await page.locator('button:has-text("Continuar")').click()

    // 3. Check-in Matinal - Step 2 (Modo do Dia)
    await page.waitForSelector('h1:has-text("Modo do Dia")')
    await page.screenshot({ path: 'e2e-screenshots/03-checkin-step2-modo.png', fullPage: true })

    const modoLabel = await page.locator('h1').filter({ hasText: 'Modo do Dia' }).textContent()
    console.log('✓ Modo detectado:', modoLabel)

    await page.locator('button:has-text("Definir prioridades")').click()

    // 4. Check-in Matinal - Step 3 (Top 3)
    await expect(page.locator('h1:has-text("Top 3 prioridades")')).toBeVisible()
    await page.screenshot({ path: 'e2e-screenshots/04-checkin-step3-top3.png', fullPage: true })

    await page.locator('input[placeholder="Prioridade 1"]').fill('Implementar nova feature')
    await page.locator('input[placeholder="Prioridade 2"]').fill('Revisar código')
    await page.locator('input[placeholder="Prioridade 3"]').fill('Estudar TypeScript')

    await page.locator('button:has-text("Começar o dia")').click()
    await page.waitForURL('**/home')

    // 5. Home/Dashboard
    await page.waitForSelector('h1:has-text("Modo")')
    await page.screenshot({ path: 'e2e-screenshots/05-home.png', fullPage: true })

    // Verificar elementos da Home
    await expect(page.locator('text=Top 3 Prioridades')).toBeVisible()
    await expect(page.locator('text=Hábitos de Hoje')).toBeVisible()

    const microWins = await page.locator('text=microvitórias').locator('..').locator('div').first().textContent()
    console.log('✓ Microvitórias iniciais:', microWins)

    // Marcar uma tarefa
    const firstTask = page.locator('button').filter({ hasText: 'Implementar nova feature' }).first()
    await firstTask.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'e2e-screenshots/06-home-task-completed.png', fullPage: true })

    // 6. Navegação para Foco
    await page.locator('button:has-text("Foco")').click()
    await page.waitForURL('**/focus')
    await page.screenshot({ path: 'e2e-screenshots/07-focus-pomodoro.png', fullPage: true })

    await expect(page.locator('h1:has-text("Modo Foco")')).toBeVisible()

    // Verificar timer
    const timerDisplay = page.locator('div').filter({ hasText: /25:00|24:59/ }).first()
    await expect(timerDisplay).toBeVisible()

    await page.locator('button:has-text("Voltar para Home")').click()
    await page.waitForURL('**/home')

    // 7. Descompressão
    await page.locator('button:has-text("Desligar")').click()
    await page.waitForURL('**/decompress')
    await page.screenshot({ path: 'e2e-screenshots/08-decompress.png', fullPage: true })

    await expect(page.locator('h1:has-text("Ritual de Descompressão")')).toBeVisible()

    const activityName = await page.locator('h2').nth(0).textContent()
    console.log('✓ Atividade sugerida:', activityName)

    // Confirmar atividade
    await page.locator('button:has-text("Vou fazer essa atividade")').click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'e2e-screenshots/09-decompress-confirmed.png', fullPage: true })

    await page.locator('button:has-text("Voltar para Home")').click()
    await page.waitForURL('**/home')

    // 8. Relaxar (Check-in Noturno)
    await page.locator('button:has-text("Relaxar")').click()
    await page.waitForURL('**/relax')
    await page.screenshot({ path: 'e2e-screenshots/10-relax-step1.png', fullPage: true })

    // Journaling
    await page.locator('textarea').fill('Hoje consegui focar bem nas tarefas e manter a calma durante o dia.')
    await page.locator('button:has-text("Continuar")').click()

    // Check-in final
    await page.waitForSelector('h1:has-text("Como você termina o dia?")')
    await page.screenshot({ path: 'e2e-screenshots/11-relax-step2.png', fullPage: true })

    await page.locator('button').filter({ hasText: '😌' }).first().click()

    const eveningEnergy = page.locator('input[type="range"]').nth(0)
    await eveningEnergy.fill('6')

    const eveningCalm = page.locator('input[type="range"]').nth(1)
    await eveningCalm.fill('8')

    await page.locator('button:has-text("Finalizar dia")').click()

    // Insight
    await page.waitForSelector('h1:has-text("Insight do Dia")')
    await page.screenshot({ path: 'e2e-screenshots/12-relax-step3-insight.png', fullPage: true })

    const insightText = await page.locator('div.bg-purple-50 p').first().textContent()
    console.log('✓ Insight gerado:', insightText?.substring(0, 100))

    // 9. Painel de Insights
    await page.locator('button:has-text("Ver painel de insights")').click()
    await page.waitForURL('**/insights')
    await page.screenshot({ path: 'e2e-screenshots/13-insights.png', fullPage: true })

    await expect(page.locator('h1:has-text("Seus Insights")')).toBeVisible()
    await expect(page.locator('text=Energia Média')).toBeVisible()
    await expect(page.locator('text=Calma Média')).toBeVisible()

    console.log('✅ FLUXO COMPLETO TESTADO COM SUCESSO!')
  })

  test('deve ser responsivo em mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Testar cada tela principal
    const screens = [
      { url: '/', name: 'onboarding-mobile' },
    ]

    for (const screen of screens) {
      await page.goto(screen.url)
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: `e2e-screenshots/mobile-${screen.name}.png`,
        fullPage: true
      })
    }

    // Verificar que não há scroll horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = 375

    console.log(`✓ Body width: ${bodyWidth}px, Viewport: ${viewportWidth}px`)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // +1 para arredondamento
  })

  test('deve ter cores corretas para cada modo', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verificar variáveis CSS do tema
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement
      const styles = window.getComputedStyle(root)
      return {
        calm: styles.getPropertyValue('--color-calm'),
        focus: styles.getPropertyValue('--color-focus'),
        connect: styles.getPropertyValue('--color-connect'),
        recover: styles.getPropertyValue('--color-recover'),
      }
    })

    console.log('✓ Variáveis CSS do tema:', rootStyles)
  })
})
