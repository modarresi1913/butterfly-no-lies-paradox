<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <br/><br/>
  <img width="800" alt="The Butterfly Effect Demo" src="https://github.com/modarresi1913/the-butterfly-effect/raw/main/assets/demo.gif">
  <br/>
  <strong>Interactive alternative history simulator powered by AI</strong>
  <br/>
  <a href="#-demo"><strong>Live Demo</strong></a>
  ·
  <a href="#-getting-started"><strong>Getting Started</strong></a>
  ·
  <a href="https://github.com/modarresi1913/the-butterfly-effect/issues"><strong>Report Bug</strong></a>
  ·
  <a href="https://github.com/modarresi1913/the-butterfly-effect/issues"><strong>Request Feature</strong></a>
</p>

---

## 🦋 The Butterfly Effect

> *"Does the flap of a butterfly's wings in Brazil set off a tornado in Texas?"* — Edward Lorenz

An interactive web application that combines **Chaos Theory**, **Alternative History**, and **AI** to simulate how small historical changes ripple through 1000 years.

### ✨ Highlights

| Feature | Description |
|---------|-------------|
| 🎯 **3-Step Wizard** | Choose a turning point → Set magnitude → Simulate |
| 🤖 **AI Timeline Engine** | LLM generates 4 branching checkpoints spanning 800+ years |
| 🎨 **AI Concept Art** | Unique generated artwork for each alternative timeline |
| 🌐 **Branching Timeline** | Animated visualization with Framer Motion |
| 🛡️ **Resilient JSON Parser** | Custom truncated-JSON repair for reliable AI responses |
| 🌑 **Cinematic UI** | Dark sci-fi theme with particle field background |

## 📸 Screenshots

<!-- Add your screenshots here -->
<!-- <img width="800" alt="Hero" src="https://github.com/modarresi1913/the-butterfly-effect/raw/main/assets/screenshot-1.png" /> -->
<!-- <img width="800" alt="Results" src="https://github.com/modarresi1913/the-butterfly-effect/raw/main/assets/screenshot-2.png" /> -->

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) |
| Components | ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black) |
| Animation | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white) |
| AI Engine | z-ai-web-dev-sdk (LLM + Image Gen) |
| Icons | ![Lucide](https://img.shields.io/badge/Lucide-latest-orange?logo=lucide) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- z-ai-web-dev-sdk access

### Installation

```bash
# Clone the repository
git clone https://github.com/modarresi1913/the-butterfly-effect.git
cd the-butterfly-effect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📖 How It Works

```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│   THE RIPPLE    │────▶│  THE MAGNITUDE│────▶│  THE TIME LEAP │
│                 │     │              │     │               │
│ Choose era,     │     │ How widely   │     │ AI generates   │
│ location &      │     │ known is the │     │ 4 checkpoints  │
│ change          │     │ change?      │     │ + concept art  │
└─────────────────┘     └──────────────┘     └───────────────┘
```

### Each Checkpoint Contains

- 🏆 **Achievements** — What humanity accomplished in this timeline
- ⚠️ **Crises** — New dangers that emerged from the change
- 🌍 **World State** — A snapshot of civilization at that point
- 🗺️ **Geography** — How borders and empires shifted
- 🖼️ **Concept Art** — AI-generated visual of the alternate world

## 🏗 Project Structure

```
the-butterfly-effect/
├── src/
│   ├── app/
│   │   ├── api/simulate/route.ts   # AI simulation endpoint
│   │   ├── globals.css               # Dark sci-fi theme
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main app (wizard + timeline)
│   └── components/ui/               # shadcn/ui components
├── .github/workflows/ci.yml         # CI pipeline
├── .env.example                     # Environment template
├── LICENSE                          # MIT License
└── package.json
```

## 🧠 Technical Deep Dives

### Resilient JSON Parsing
AI models often truncate JSON responses. This project uses a custom `repairTruncatedJSON()` function that:
- Strips markdown code fences
- Fixes trailing commas
- Detects unclosed strings and removes incomplete key-value pairs
- Auto-closes unclosed brackets and braces

### Hydration-Safe Particles
The particle field background uses deterministic positioning (modular arithmetic) instead of `Math.random()` to prevent Next.js SSR hydration mismatches.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 🦋 by <a href="https://github.com/modarresi1913">modarresi1913</a>
</p>