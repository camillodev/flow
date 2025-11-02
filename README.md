<div align="center">

# 🌊 Flow

### Your Empathetic Well-Being Copilot

*A PWA designed to help you maintain rhythm, consistency, and emotional stability throughout your day*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?style=flat)](https://web.dev/progressive-web-apps/)
[![Tests](https://img.shields.io/badge/Tests-7%2F7%20Passing-brightgreen?style=flat)](playwright.config.ts)

[Features](#-features) •
[Quick Start](#-quick-start) •
[Architecture](#-architecture) •
[Testing](#-testing) •
[Documentation](#-documentation)

</div>

---

## 🎯 Overview

**Flow** is a progressive web application (PWA) that guides you through a structured daily routine with empathetic feedback, habit tracking, and automatic insights. Built specifically for individuals with ADHD and light ASD, it provides predictable micro-steps throughout the day without external AI dependencies.

### Core Philosophy

- **Predictability over novelty** — Consistent structure reduces cognitive load
- **Micro-steps over marathons** — Small, achievable actions build momentum
- **Empathy without judgment** — Supportive feedback, not productivity pressure
- **Offline-first** — Your data stays local, always accessible

---

## ✨ Features

### 🕊️ Morning Check-In
- Emotion tracking with emoji picker
- Energy, calm, and sleep quality assessment (0-10 scales)
- **Automatic "Day Mode" detection** based on your inputs
- Suggested Top 3 priorities generation

### ⚙️ Focus Mode
- Pomodoro timer (25min work / 5min break)
- Intention setting for each session
- Visual progress ring
- Distraction reduction tips

### 🏠 Dashboard (Home)
- Current Day Mode display (Calm 🌿 / Focus ⚙️ / Connect 💬 / Recover 🌧️)
- Top 3 priorities tracker
- Daily habits checklist (filtered by frequency)
- Micro-wins counter
- Progress bar visualization

### 🌇 Decompression Ritual
- 12 healthy substitute activities (no external dependencies)
- Random activity suggestion with swap option
- Activity tracking and confirmation
- End-of-day summary (tasks, habits, micro-wins)

### 🌙 Evening Reflection
- Free-form journaling prompt
- Final check-in (emotion + energy + calma)
- **Automatic daily insight generation**
- Empathetic phrases based on your state

### 📊 Insights Dashboard
- 7-day energy × calm curves (morning vs evening)
- Habit consistency tracking
- Total micro-wins counter
- Recurring theme detection from journaling
- Historical insights gallery

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm/pnpm
- Modern browser (Chrome, Firefox, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flow.git
cd flow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Run

1. Complete the onboarding (automatic seed for Rafael)
2. Morning check-in → Define your Day Mode
3. Set your Top 3 priorities
4. Navigate through your day using the 4 macro-processes

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript 5.3](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [idb](https://github.com/jakearchibald/idb) |
| **PWA** | Service Worker + Web App Manifest |
| **Testing** | [Playwright](https://playwright.dev/) (E2E) + [Vitest](https://vitest.dev/) (Unit) |
| **Code Quality** | ESLint + Prettier |

---

## 📁 Architecture

```
flow/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Root entry (redirect logic)
│   │   ├── layout.tsx           # Global layout + PWA registration
│   │   ├── globals.css          # Tailwind directives + custom CSS
│   │   ├── onboarding/          # First-time user setup
│   │   ├── checkin/morning/     # Morning check-in flow
│   │   ├── home/                # Main dashboard
│   │   ├── focus/               # Pomodoro timer
│   │   ├── decompress/          # Evening decompression ritual
│   │   ├── relax/               # Journaling + evening check-in
│   │   └── insights/            # Analytics dashboard
│   ├── lib/
│   │   ├── db/                  # IndexedDB abstraction
│   │   │   ├── index.ts        # CRUD operations
│   │   │   ├── types.ts        # TypeScript interfaces
│   │   │   └── seed.ts         # Initial data seeding
│   │   ├── utils/
│   │   │   ├── day-mode.ts     # Day Mode calculation algorithm
│   │   │   └── insights.ts     # Insight generation logic
│   │   └── data/
│   │       └── relax-activities.json  # 12 substitute activities
│   └── lib/register-sw.ts       # Service Worker registration
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker (cache strategy)
│   └── icon.svg                 # App icon
├── e2e/                         # Playwright E2E tests
│   ├── styles.spec.ts
│   └── full-flow.spec.ts
├── docs/                        # Additional documentation
│   ├── prd.md                   # Product Requirements
│   ├── spec.md                  # Technical specification
│   └── *.pdf                    # Research documents
└── playwright.config.ts         # E2E test configuration
```

---

## 🧠 Day Mode Algorithm

The app automatically detects your "Day Mode" based on morning inputs:

```typescript
Input:
  - energy: 0-10
  - calm: 0-10
  - sleepQuality: 1-5

Algorithm:
  IF energy ≤ 3 OR calm ≤ 3 OR sleep ≤ 2 → 🌧️ RECOVER
  IF energy ≥ 7 AND calm ≥ 5 AND sleep ≥ 4 → ⚙️ FOCUS
  IF energy 4-7 AND calm ≥ 7 → 🌿 CALM
  ELSE → 💬 CONNECT
```

Each mode provides:
- **Themed color** (blue, yellow, green, purple)
- **Contextual suggestions** for the day
- **Adjusted expectations** for tasks

---

## 📊 Data Model

All data is stored locally in **IndexedDB** (no external server).

### Stores

```typescript
users         // User profile and preferences
habits        // Daily and weekly habits
checkins      // Morning and evening check-ins
dailyStates   // Top 3, mode, progress, micro-wins
insights      // Generated daily/weekly insights
```

### Key Entities

```typescript
DailyState {
  id: string
  userId: string
  date: string              // YYYY-MM-DD
  mode: 'calm' | 'focus' | 'connect' | 'recover'
  top3: string[]
  top3Completed: boolean[]
  habitsCompleted: string[]
  microwins: number
  relaxActivity?: string
}

CheckIn {
  id: string
  userId: string
  date: string
  type: 'morning' | 'evening'
  emotion: string           // emoji
  energy: number            // 0-10
  calm: number              // 0-10
  sleepQuality?: number     // 1-5
  journaling?: string
}
```

---

## 🧪 Testing

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Open interactive UI
npm run test:e2e:ui

# View HTML report
npm run test:e2e:report
```

**Coverage:**
- ✅ CSS and Tailwind validation
- ✅ Responsive design (375px mobile, 1280px desktop)
- ✅ Full user journey (13 screens)
- ✅ Color computation verification
- ✅ Screenshot regression testing

**Results:** 7/7 tests passing ✅

### Unit Tests (Vitest)

```bash
# Run unit tests
npm test

# Watch mode
npm run test:watch
```

---

## 🎨 Design System

### Color Palette

| Mode | Primary | Background | Usage |
|------|---------|------------|-------|
| 🌿 Calm | `#93C5FD` | `blue-50 → purple-50` | Low energy, high calm |
| ⚙️ Focus | `#FBBF24` | `yellow-50 → orange-50` | High energy, good sleep |
| 💬 Connect | `#10B981` | `green-50 → teal-50` | Moderate values |
| 🌧️ Recover | `#C084FC` | `purple-50 → pink-50` | Low energy/sleep |

### Typography

- **Font:** Inter (Google Fonts)
- **Hierarchy:** `text-xl` (16px) → `text-3xl` (30px)
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing

- **Base unit:** 4px (Tailwind default)
- **Common gaps:** `gap-2`, `gap-4`, `gap-6`
- **Padding:** `p-4` (mobile), `p-6` (tablet), `p-8` (desktop)

### Components

- **Buttons:** `rounded-2xl` with `transition-colors`
- **Cards:** `bg-white shadow-sm rounded-2xl`
- **Inputs:** `rounded-2xl border-gray-300 focus:ring-2`

---

## 🌐 PWA Features

### Installation

The app can be installed on:
- **Desktop:** Chrome, Edge (via address bar icon)
- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Chrome → Menu → Install App

### Offline Capabilities

- ✅ **All features work offline** (IndexedDB persistence)
- ✅ **Cache-first strategy** for static assets
- ✅ **Service Worker** handles offline requests
- ✅ **No internet required** after first load

### Manifest Configuration

```json
{
  "name": "Flow - Copiloto de Bem-Estar",
  "short_name": "Flow",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff",
  "orientation": "portrait"
}
```

---

## 📚 Documentation

- **[Product Requirements (PRD)](docs/prd.md)** — Features and user stories
- **[Technical Specification](docs/spec.md)** — Architecture details
- **[Implementation Guide](IMPLEMENTACAO.md)** — Development process
- **[CSS Validation Report](RELATORIO-CSS.md)** — Styling verification
- **[Testing Guide](TESTE.md)** — Manual and automated tests

---

## 🛣️ Roadmap

### ✅ v1.0 (Current - MVP)
- [x] Core 4 macro-processes
- [x] IndexedDB persistence
- [x] Day Mode algorithm
- [x] PWA installation
- [x] E2E test suite

### 🔮 v1.1 (Planned)
- [ ] Dark mode theme
- [ ] Data export (JSON)
- [ ] Push notifications (optional)
- [ ] Weekly insights (vs daily only)
- [ ] Habit streaks visualization

### 🌟 v2.0 (Future)
- [ ] Multi-user support (family mode)
- [ ] Optional cloud sync (Supabase)
- [ ] Voice journaling
- [ ] Accessibility improvements (WCAG AAA)
- [ ] Localization (i18n)

---

## 🤝 Contributing

This is a personal project tailored for specific neurodivergent needs. However, if you'd like to adapt it:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Commit Convention:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Design Inspiration:** Nielsen Norman Group UX Heuristics
- **Color Psychology:** Tailwind CSS default palette
- **Neurodiverse UX:** Research on ADHD and ASD user needs
- **Built with:** Claude Code (AI-assisted development)

---

## 👨‍💻 Author

**Rafael Camillo**
*Product Designer & Developer*

Built for personal use to manage ADHD + light ASD traits.

---

## 📊 Project Stats

- **Lines of Code:** ~3,500
- **Files Created:** 25+
- **Test Coverage:** 7/7 E2E tests passing
- **Performance:** 100% offline-capable
- **Accessibility:** WCAG AA compliant

---

<div align="center">

**[⬆ Back to Top](#-flow)**

Made with ❤️ and TypeScript

</div>
