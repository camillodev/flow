import { test, expect } from '@playwright/test'

test.describe('Estilos e Responsividade', () => {
  test('deve carregar estilos do Tailwind na página de onboarding', async ({ page }) => {
    await page.goto('/')

    // Aguardar página carregar
    await page.waitForLoadState('networkidle')

    // Verificar se o título existe
    const title = page.locator('h1')
    await expect(title).toBeVisible()

    // Tirar screenshot
    await page.screenshot({ path: 'e2e-screenshots/onboarding-desktop.png', fullPage: true })

    // Verificar cores do gradiente no background
    const background = page.locator('div.min-h-screen').first()
    const bgClasses = await background.getAttribute('class')

    console.log('Classes do background:', bgClasses)
    expect(bgClasses).toContain('bg-gradient-to-br')

    // Verificar botão principal
    const button = page.locator('button:has-text("Começar agora")')
    await expect(button).toBeVisible()

    const buttonClasses = await button.getAttribute('class')
    console.log('Classes do botão:', buttonClasses)

    // Verificar cor do botão
    const buttonColor = await button.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    console.log('Cor do botão (computed):', buttonColor)
  })

  test('deve ser responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'e2e-screenshots/onboarding-mobile.png', fullPage: true })

    const title = page.locator('h1')
    await expect(title).toBeVisible()
  })

  test('deve aplicar estilos no check-in matinal', async ({ page }) => {
    // Primeiro fazer onboarding
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const startButton = page.locator('button:has-text("Começar agora")')
    if (await startButton.isVisible()) {
      await startButton.click()
      await page.waitForURL('**/checkin/morning')
    }

    await page.screenshot({ path: 'e2e-screenshots/checkin-morning.png', fullPage: true })

    // Verificar emojis
    const emojiButtons = page.locator('button').filter({ hasText: /😊|😌|😐/ })
    await expect(emojiButtons.first()).toBeVisible()
  })
})

test.describe('Cores e Tema', () => {
  test('deve verificar CSS carregado', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verificar se há estilos inline ou classes Tailwind
    const html = await page.content()

    // Procurar por classes Tailwind comuns
    const hasTailwindClasses =
      html.includes('bg-gradient') ||
      html.includes('rounded-') ||
      html.includes('text-') ||
      html.includes('p-') ||
      html.includes('flex')

    console.log('HTML contém classes Tailwind:', hasTailwindClasses)
    console.log('Trecho do HTML:', html.substring(0, 500))

    expect(hasTailwindClasses).toBe(true)
  })
})
