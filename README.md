<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0a0a0f&height=180&section=header&text=The%20Butterfly%20Effect&fontSize=42&fontColor=f59e0b&animation=twinkling&fontAlignY=32&desc=AI-Powered%20Alternate%20History%20Simulator&descSize=18&descColor=94a3b8" alt="banner" />

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-18181B?style=flat-square" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/License-MIT-238636?style=flat-square" alt="License" />
</p>

<p>
  <a href="https://github.com/modarresi1913/the-butterfly-effect/issues?q=is%3Aissue+is%3Aopen+label%3Abug"><img src="https://img.shields.io/github/issues/modarresi1913/the-butterfly-effect?style=flat-square&label=issues" alt="Issues" /></a>
  <a href="https://github.com/modarresi1913/the-butterfly-effect/stargazers"><img src="https://img.shields.io/github/stars/modarresi1913/the-butterfly-effect?style=flat-square&label=stars" alt="Stars" /></a>
  <a href="https://github.com/modarresi1913/the-butterfly-effect/network/members"><img src="https://img.shields.io/github/forks/modarresi1913/the-butterfly-effect?style=flat-square&label=forks" alt="Forks" /></a>
</p>

<p>
  <b>What if a single flutter changed the course of history?</b><br/>
  <i>Pick a moment. Change it. Watch 1,000 years unfold.</i>
</p>

<!-- REPLACE with your actual demo GIF -->
<img width="700" alt="Demo" src="https://github.com/modarresi1913/the-butterfly-effect/assets/demo.gif" />

</div>

---

## About

> "Does the flap of a butterfly's wings in Brazil set off a tornado in Texas?" 
> — <i>Edward Lorenz, 1972</i>

**The Butterfly Effect** is an interactive web application that merges **Chaos Theory**, **Alternative History**, and **Generative AI** into a cinematic experience. Users choose a historical turning point, and the AI engine simulates how that tiny change ripples across centuries — generating unique timelines, world states, and concept art along the way.

---

## Features

<table>
<tr>
<td width="50%">

### 🎯 3-Step Wizard
Simple, guided flow:
1. **The Ripple** — Choose an era, location, and a small change
2. **The Magnitude** — Set how widely the change spreads (Secret / Limited / Public)
3. **The Time Leap** — Watch AI generate the alternate timeline

</td>
<td width="50%">

### 🤖 AI Timeline Engine
- LLM generates **4 branching checkpoints** spanning 800+ years
- Each checkpoint includes achievements, crises, world state, and geography
- **AI-generated concept art** for the final era
- Smart retry + fallback for reliable responses

</td>
</tr>
<tr>
<td width="50%">

### 🌐 Interactive Visualization
- Animated branching timeline with Framer Motion
- Expandable checkpoint cards with rich detail
- Responsive design — works on mobile and desktop

</td>
<td width="50%">

### 🛡️ Battle-Tested Engineering
- **Resilient JSON parser** — repairs truncated LLM responses
- **Hydration-safe particles** — deterministic SSR (no `Math.random()`)
- **Graceful degradation** — smart fallback checkpoints if AI fails
- Request normalization — missing fields auto-filled

</td>
</tr>
</table>

---

## Quick Start

```bash
git clone https://github.com/modarresi1913/the-butterfly-effect.git
cd the-butterfly-effect
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000** and start simulating history.

<details>
<summary><b>⚙️ Production Build</b></summary>

```bash
npm run build
npm start
```

</details>

<details>
<summary><b>📦 Tech Stack Details</b></summary>

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | ![Next.js 16](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js) | App Router, SSR, API Routes |
| Language | ![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type safety |
| Styling | ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Utility-first CSS |
| UI Kit | shadcn/ui | Accessible, composable components |
| Animation | ![Framer Motion 11](https://img.shields.io/badge/Framer-11-FF0055?style=flat-square&logo=framer&logoColor=white) | Page transitions, timeline animation |
| AI | z-ai-web-dev-sdk | LLM completions + image generation |
| Icons | ![Lucide](https://img.shields.io/badge/Lucide-latest-F97316?style=flat-square&logo=lucide) | Consistent icon system |

</details>

---

## How It Works

```
  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
  │              │       │              │       │              │       │              │
  │  THE RIPPLE  │──────▶│ THE MAGNITUDE│──────▶│ THE TIME LEAP│──────▶│  TIMELINE    │
  │              │       │              │       │              │       │  RESULTS     │
  │  Era         │       │  Secret      │       │  AI generates│       │              │
  │  Location    │       │  Limited     │       │  4 epochs    │       │  Checkpoint 1│
  │  Change      │       │  Public      │       │  + art       │       │  Checkpoint 2│
  │              │       │              │       │              │       │  Checkpoint 3│
  └──────────────┘       └──────────────┘       └──────────────┘       │  Checkpoint 4│
                                                                          │  + AI Art   │
                                                                          └──────────────┘
```

### Checkpoint Data Model

Each AI-generated checkpoint contains:

```typescript
interface Checkpoint {
  year: string;           // "500 BC", "+200 years"
  era_label: string;      // "The Printing Dawn"
  achievements: string[]; // ["Mass book production", "..."]
  crises: string[];       // ["Resistance from priests"]
  world_state: string;    // "Persia became the knowledge center..."
  geography: string;      // "The Achaemenid Empire expanded..."
  image_prompt: string;   // Visual description for AI art generation
}
```

---

## Project Structure

```
the-butterfly-effect/
├── src/
│   ├── app/
│   │   ├── api/simulate/
│   │   │   └── route.ts          # 🧠 AI simulation endpoint
│   │   ├── globals.css            # 🎨 Dark sci-fi theme + animations
│   │   ├── layout.tsx             # 📐 Root layout (LTR, metadata)
│   │   └── page.tsx               # 🦋 Main app (wizard + timeline)
│   └── components/
│       └── ui/                    # shadcn/ui primitives
├── .github/                       # CI, issue templates, PR template
├── .env.example                   # Environment variables template
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # MIT
└── README.md                      # You are here 📍
```

---

## Technical Deep Dives

<details>
<summary><b>🛡️ Resilient JSON Parsing</b></summary>

AI models frequently truncate their JSON output. This project implements a multi-layer repair strategy:

1. **Strip markdown fences** — Removes ```json ... ``` wrappers
2. **Fix trailing commas** — Cleans `{a: 1,}` → `{a: 1}`
3. **Detect unclosed strings** — Finds the last unclosed quote and removes the incomplete key-value pair
4. **Auto-close brackets** — Counts open/close braces and appends missing closers
5. **Validate structure** — Ensures all required fields exist before rendering

This reduces LLM response failures from ~40% to near-zero.

</details>

<details>
<summary><b>💧 Hydration-Safe Particle Field</b></summary>

Next.js SSR requires server and client markup to match. Using `Math.random()` in components causes hydration mismatches because the server generates different values than the client.

**Solution:** Deterministic positioning via modular arithmetic:
```javascript
// Instead of Math.random()
const x = ((i * 37 + 13) % 97) * 1.03;
const y = ((i * 53 + 7) % 89) * 1.14;
```
This produces visually random-looking distributions that are identical on server and client.

</details>

<details>
<summary><b>🔄 Smart Retry + Fallback</b></summary>

```
Attempt 1: LLM call → parse → validate  ✅/❌
Attempt 2: LLM call → parse → validate  ✅/❌
Fallback:  Hand-crafted checkpoints    ✅
```

The system makes 2 attempts with the LLM. If both fail (truncation, invalid format, timeout), it falls back to pre-written thematic checkpoints so the user **always** gets a result.

</details>

---

## Roadmap

- [ ] Shareable timeline links
- [ ] Multiple branching paths (user chooses at each checkpoint)
- [ ] Historical comparison mode (real vs. alternate)
- [ ] Export as PDF / image
- [ ] Community timeline gallery
- [ ] Mobile app (React Native)

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Fork the repository
3. Create a feature branch
4. Open a Pull Request

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0a0a0f&height=100&section=footer" alt="footer" />

<br/>

<b>Built with 🦋 by <a href="https://github.com/modarresi1913">modarresi1913</a></b>
<br/>
<sub>If you like this project, consider giving it a ⭐!</sub>

</div>