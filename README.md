<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0a0a0f&height=180&section=header&text=Butterfly%20Effect%3A%20No-Lies%20Paradox&fontSize=36&fontColor=f59e0b&animation=twinkling&fontAlignY=32&desc=AI-Powered%20Alternate%20History%20Simulator%20%E2%80%94%20Chaos%20Theory%20%C3%97%20Counterfactual%20Thinking&descSize=16&descColor=94a3b8" alt="banner" />

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-18181B?style=flat-square" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/License-MIT-238636?style=flat-square" alt="License" />
</p>

<p>
  <img src="https://img.shields.io/github/stars/modarresi1913/butterfly-no-lies-paradox?style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/forks/modarresi1913/butterfly-no-lies-paradox?style=flat-square" alt="Forks" />
  <img src="https://img.shields.io/github/issues/modarresi1913/butterfly-no-lies-paradox?style=flat-square" alt="Issues" />
  <img src="https://img.shields.io/badge/forked%20from-the_butterfly_effect-amber?style=flat-square" alt="Forked from" />
</p>

<p>
  <b>What if a single butterfly flap rewrote a thousand years of history?</b><br/>
  <i>Pick a moment. Change one variable. Watch the cascade unfold.</i>
</p>

</div>

---

## Overview

> "Does the flap of a butterfly's wings in Brazil set off a tornado in Texas?"
> — <i>Edward Lorenz, 1972</i>

**Butterfly Effect: No-Lies Paradox** is a fork of [modarresi1913/the-butterfly-effect](https://github.com/modarresi1913/the-butterfly-effect) — an interactive **alternate history simulator** powered by **generative AI**, **chaos theory**, and **counterfactual reasoning**.

Users choose a historical turning point, set its magnitude, and the AI engine simulates how that tiny change ripples across centuries — generating unique **timelines**, **world states**, and **concept art** along the way.

### What This Fork Adds

This fork introduces a **featured deep-dive scenario** — *The No-Lies Paradox* — a systematic exploration of what happens when the concept of lying is biologically removed from the human brain in 1026 AD:

- **6 interactive dimensions** — Politics, Science, Religion, Economy, Art, Geopolitics
- **Comparison engine** — Our World vs. World Without Lies across 8 measurable domains
- **The Plot Twist** — Why a deception-free civilization reaches Mars faster but suffers 35% depression rates
- One-click **AI simulation** that generates a full alternate timeline from the scenario

---

## The No-Lies Paradox: 6 Dimensions

| # | Dimension | Core Question |
|---|-----------|---------------|
| 1 | **Political Collapse** | What happens to feudalism when kings can't claim divine right? |
| 2 | **Scientific Explosion** | Could the Industrial Revolution arrive in the 13th century? |
| 3 | **Religious Crisis** | Do religions survive when priests can't claim absolute truth? |
| 4 | **Economy Without Credit** | Can civilization thrive without financial deception? |
| 5 | **Art Without Pretense** | Is literature possible when hypocrisy is biologically impossible? |
| 6 | **Transparent Colonialism** | What if conquerors must say "we come for your gold"? |

### Comparison: Our World vs. No-Lies World (2026 AD)

| Domain | Our World | No-Lies World | Who Wins? |
|--------|-----------|---------------|-----------|
| Science & Tech | AI, CRISPR, Internet | Mars colonisation, 150yr lifespan | No-Lies |
| Politics | Inefficient democracy, propaganda | Technical management systems | No-Lies |
| Art & Literature | Novels, cinema, humor | Poetry, documentary, abstract music | Ours |
| War & Conflict | Proxy wars, terrorism | Rare but devastating wars | Tie |
| Economy | Bubbles, recurring crises | Stable barter-based system | Tie |
| Mental Health | ~20% depression | ~35% depression (ruthless truth) | Ours |
| Religion | Institutional, holy wars | Personal mysticism, ethics | No-Lies |
| Love & Relationships | Romantic, idealized | Stable but passionless | Ours |

> **The Punchline:** *We reached the Moon a thousand years earlier — but during the journey, the astronauts kept telling each other: your body odor is truly horrific.*

---

## Features

<table>
<tr>
<td width="50%">

### 3-Step Simulation Wizard
1. **The Ripple** — Choose era, location, and change
2. **The Magnitude** — Secret / Limited / Public
3. **The Time Leap** — AI generates the alternate timeline

Pre-built scenarios include:
- No-Lies Paradox (1026 AD)
- Printing Press by Cyrus the Great (500 BC)
- Ancient Egyptian Batteries (1200 BC)
- Aristotle Discovers Atomic Energy (330 BC)

</td>
<td width="50%">

### No-Lies Deep Dive
- **6 expandable dimension cards** with key points
- **Alternate-world quotes** ("These tulips are just bulbs" — Dutch merchant)
- **8-domain comparison table** with advantage indicators
- **Plot Twist section** — the civilization paradox
- **AI simulation button** — generate a full timeline from the scenario

</td>
</tr>
<tr>
<td width="50%">

### AI Timeline Engine
- LLM generates **4 branching checkpoints** spanning 800+ years
- Each checkpoint: achievements, crises, world state, geography
- **AI-generated concept art** for the final era
- Smart retry + fallback for reliable responses

</td>
<td width="50%">

### Engineering
- **Resilient JSON parser** — repairs truncated LLM output
- **Hydration-safe particles** — deterministic SSR
- **Graceful degradation** — fallback checkpoints if AI fails
- **Framer Motion** animations throughout

</td>
</tr>
</table>

---

## Quick Start

```bash
git clone https://github.com/modarresi1913/butterfly-no-lies-paradox.git
cd butterfly-no-lies-paradox
bun install
cp .env.example .env.local
bun run dev
```

Open **http://localhost:3000**

<details>
<summary><b>Production Build</b></summary>

```bash
bun run build
bun run start
```

</details>

<details>
<summary><b>Tech Stack</b></summary>

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js 16 | App Router, SSR, API Routes |
| Language | TypeScript 5 | Type safety |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| UI Kit | shadcn/ui | Accessible, composable components |
| Animation | Framer Motion 12 | Page transitions, timeline |
| AI | z-ai-web-dev-sdk | LLM + image generation |
| Icons | Lucide | Consistent icon system |

</details>

---

## Architecture

```
  User Input          AI Engine              Output
  ┌──────────┐       ┌──────────┐       ┌──────────────┐
  │  Era     │       │          │       │ Checkpoint 1 │
  │  Location │──────▶│   LLM    │──────▶│ Checkpoint 2 │
  │  Change   │       │  + Image │       │ Checkpoint 3 │
  │  Magnitude│       │   Gen    │       │ Checkpoint 4 │
  └──────────┘       └──────────┘       │ + Concept Art│
                                         └──────────────┘

  Deep Dive (No-Lies)  ────▶  6 Dimensions  ────▶  Comparison Table  ────▶  AI Simulate
```

### Checkpoint Data Model

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
butterfly-no-lies-paradox/
├── src/
│   ├── app/
│   │   ├── api/simulate/
│   │   │   └── route.ts          # AI simulation endpoint (LLM + image gen)
│   │   ├── globals.css            # Dark sci-fi theme + custom animations
│   │   ├── layout.tsx             # Root layout + metadata
│   │   └── page.tsx               # Main app: wizard + deep dive + timeline
│   └── components/ui/             # shadcn/ui component library
├── prisma/
│   └── schema.prisma              # Database schema (SQLite)
├── LICENSE                        # MIT
├── CONTRIBUTING.md                # Contribution guidelines
└── README.md                      # You are here
```

---

## Technical Deep Dives

<details>
<summary><b>Resilient JSON Parsing</b></summary>

AI models frequently truncate their JSON output. This project uses a multi-layer repair strategy:

1. **Strip markdown fences** — Removes ```json ... ``` wrappers
2. **Fix trailing commas** — Cleans `{a: 1,}` to `{a: 1}`
3. **Detect unclosed strings** — Finds the last unclosed quote, removes incomplete key-value pair
4. **Auto-close brackets** — Counts open/close braces, appends missing closers
5. **Validate structure** — Ensures all required fields exist before rendering

This reduces LLM response failures from ~40% to near-zero.

</details>

<details>
<summary><b>Hydration-Safe Particle Field</b></summary>

Next.js SSR requires server and client markup to match. Using `Math.random()` causes hydration mismatches.

**Solution:** Deterministic positioning via modular arithmetic:
```javascript
const x = ((i * 37 + 13) % 97) * 1.03;
const y = ((i * 53 + 7) % 89) * 1.14;
```
Produces visually random distributions that are identical on server and client.

</details>

<details>
<summary><b>Smart Retry + Fallback</b></summary>

```
Attempt 1: LLM call -> parse -> validate  [pass/fail]
Attempt 2: LLM call -> parse -> validate  [pass/fail]
Fallback:  Hand-crafted checkpoints     [always pass]
```

2 LLM attempts with automatic fallback to pre-written thematic checkpoints. Users always get a result.

</details>

---

## Keywords

`alternate-history` `butterfly-effect` `chaos-theory` `counterfactual` `ai-simulator` `what-if-scenario` `no-lies-paradox` `alternate-timeline` `generative-ai` `nextjs` `shadcn-ui` `framer-motion` `thought-experiment` `historical-simulation` `worldbuilding`

---

## Acknowledgments

- **Original project:** [modarresi1913/the-butterfly-effect](https://github.com/modarresi1913/the-butterfly-effect) — the AI-powered alternate history simulator this fork builds upon
- **Edward Lorenz** — for the chaos theory that inspired it all
- **z-ai-web-dev-sdk** — AI inference engine powering the simulations

---

## License

[MIT](LICENSE) — forked from [the-butterfly-effect](https://github.com/modarresi1913/the-butterfly-effect) under the same license.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0a0a0f&height=100&section=footer" alt="footer" />

<br/>

<b>Forked with thought-experiment love from <a href="https://github.com/modarresi1913/the-butterfly-effect">the-butterfly-effect</a></b>
<br/>
<sub>If you enjoy alternate history & what-if scenarios, consider giving this fork a star!</sub>

</div>
