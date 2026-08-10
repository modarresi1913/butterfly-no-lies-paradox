# Contributing to The Butterfly Effect

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
# Clone and install
git clone https://github.com/modarresi1913/the-butterfly-effect.git
cd the-butterfly-effect
npm install

# Start dev server
npm run dev
```

## Code Style

- **TypeScript**: Strict mode enabled. All types must be explicit where inference isn't clear.
- **Components**: Use functional components with hooks. Prefer `const` arrow functions.
- **Styling**: Tailwind CSS utilities first. Avoid custom CSS unless absolutely necessary.
- **Formatting**: No trailing commas in JSON. Consistent 2-space indentation.

## Project Architecture

```
src/app/
├── page.tsx              # Main UI (wizard + timeline visualization)
├── api/simulate/route.ts # AI simulation API endpoint
├── layout.tsx            # Root layout (font, metadata, direction)
└── globals.css          # Theme, animations, custom properties
```

## Submitting a PR

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make your changes and test: `npm run build`
3. Commit with a clear message: `git commit -m 'Add: your feature'`
4. Push and open a PR against `main`

## AI Response Handling

The AI simulation endpoint (`/api/simulate`) uses a custom JSON repair function (`repairTruncatedJSON`) to handle truncated LLM responses. When modifying the prompt or response format, ensure:

- The prompt requests **raw JSON only** (no markdown fences)
- Response fields are kept **short** (max 10 words per field)
- All checkpoint fields are validated and normalized before sending to client

## Questions?

Open an issue with the `[Question]` label and we'll help you out!