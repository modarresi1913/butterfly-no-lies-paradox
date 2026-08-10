# 🦋 The Butterfly Effect

Interactive alternative history simulator — explore how small historical changes ripple through 1000 years using AI-powered timeline generation.

## ✨ Features

- 🎯 **3-Step Wizard**: Choose a turning point → Set magnitude → Simulate
- 🤖 **AI-Powered Timelines**: LLM generates 4 branching checkpoints spanning 800+ years
- 🎨 **AI-Generated Art**: Concept art for each alternative timeline
- 🌐 **Interactive Timeline**: Animated branching visualization with Framer Motion
- 🌑 **Dark Sci-Fi UI**: Particle field background, glow effects, cinematic feel

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **AI**: z-ai-web-dev-sdk (LLM + Image Generation)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

1. **The Ripple** — Pick a historical era, location, and a small change (e.g., "Invention of printing press by Cyrus the Great")
2. **The Magnitude** — Choose how widely known the change is: Secret, Limited, or Public
3. **The Time Leap** — AI simulates 4 checkpoints (200 years apart) showing how your change reshapes history

Each checkpoint includes:
- 🏆 Achievements of that era
- ⚠️ Crises that emerged
- 🌍 World state description
- 🗺️ Geographic changes
- 🖼️ AI-generated concept art

## 📄 License

MIT
