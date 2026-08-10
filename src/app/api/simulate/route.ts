import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SimulationRequest {
  era: string;
  location: string;
  change: string;
  magnitude: 'secret' | 'limited' | 'public';
}

const SYSTEM_PROMPT = `You are an alternative history AI for "The Butterfly Effect". Create 4 timeline checkpoints spanning 800 years after a historical divergence.

CRITICAL RULES:
- Keep ALL text EXTREMELY SHORT: max 10 words per field, max 3 items per array
- world_state: 1 sentence max
- geography: 1 sentence max
- image_prompt: max 15 English words, rich visual details
- Output ONLY raw valid JSON. No markdown. No explanation. No trailing commas.

FORMAT:
{"checkpoints":[{"year":"500 BC","era_label":"The Printing Dawn","achievements":["Invention of printing","Mass book production"],"crises":["Resistance from priests"],"world_state":"Persia became the knowledge center of the world.","geography":"The Achaemenid Empire expanded rapidly.","image_prompt":"Ancient Persian library with printing presses, golden hour, cinematic"}]}

Exactly 4 checkpoints, each 200 years apart.`;

function repairTruncatedJSON(text: string): any | null {
  let cleaned = text.trim();

  const cb = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (cb) cleaned = cb[1].trim();

  const start = cleaned.indexOf('{');
  if (start === -1) return null;
  let json = cleaned.substring(start);

  try { return JSON.parse(json); } catch {}
  json = json.replace(/,\s*([\]\}])/g, '$1');
  try { return JSON.parse(json); } catch {}

  // Repair truncated JSON
  let inString = false;
  let escaped = false;
  let lastQuoteIdx = -1;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; lastQuoteIdx = i; }
  }

  let repaired = json;
  if (inString) {
    const lastComma = repaired.lastIndexOf(',', lastQuoteIdx);
    const lastObjOpen = repaired.lastIndexOf('{', lastQuoteIdx);
    if (lastComma > lastObjOpen) {
      repaired = repaired.substring(0, lastComma);
    } else {
      repaired = repaired.substring(0, lastObjOpen + 1);
    }
  }

  let openB = 0, closeB = 0, openC = 0, closeC = 0;
  for (const ch of repaired) {
    if (ch === '{') openB++; else if (ch === '}') closeB++;
    else if (ch === '[') openC++; else if (ch === ']') closeC++;
  }
  while (closeC < openC) { repaired += ']'; closeC++; }
  while (closeB < openB) { repaired += '}'; closeB++; }
  repaired = repaired.replace(/,\s*([\]\}])/g, '$1');

  try { return JSON.parse(repaired); } catch {}
  return null;
}

function validateCheckpoints(data: any): boolean {
  if (!data?.checkpoints || !Array.isArray(data.checkpoints) || data.checkpoints.length === 0) return false;
  return data.checkpoints[0].era_label && data.checkpoints[0].world_state;
}

function getFallbackCheckpoints(era: string, location: string, change: string): any[] {
  return [
    {
      year: era,
      era_label: 'The Divergence',
      achievements: [change, 'The ripple begins'],
      crises: ['Resistance to change'],
      world_state: `In ${location}, ${change} altered history forever.`,
      geography: `${location} became the epicenter of a new world.`,
      image_prompt: `Ancient city of ${location}, golden hour, cinematic concept art`
    },
    {
      year: '+200 years',
      era_label: 'The Ripple Spreads',
      achievements: ['Technology expands', 'New networks form'],
      crises: ['Resource wars'],
      world_state: 'The change spread to neighboring civilizations, old orders collapsed.',
      geography: 'Empire borders shifted dramatically.',
      image_prompt: 'Medieval city with advanced technology, oil painting, dramatic'
    },
    {
      year: '+400 years',
      era_label: 'The New Order',
      achievements: ['Scientific revolution', 'New civilization rises'],
      crises: ['Environmental crisis'],
      world_state: 'A civilization unlike anything in real history emerged.',
      geography: 'New global powers rose from the ashes.',
      image_prompt: 'Futuristic ancient city, dramatic sunset, concept art, 8K'
    },
    {
      year: '+800 years',
      era_label: 'The Final State',
      achievements: ['A transformed world', 'Unimaginable progress'],
      crises: ['New ethical dilemmas'],
      world_state: 'After 800 years, the world became unrecognizable.',
      geography: 'The world map was completely redrawn.',
      image_prompt: 'Epic futuristic city, ancient architecture merged with tech, cinematic'
    }
  ];
}

async function callLLM(zai: any, systemPrompt: string, userPrompt: string): Promise<string> {
  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    stream: false,
    max_tokens: 1200,
  });

  if (completion?.choices?.[0]?.message?.content) return completion.choices[0].message.content;
  if (typeof completion === 'string') return completion;
  if (completion?.output?.text) return completion.output.text;
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();
    const { era, location, change, magnitude } = body;

    const magnitudeMap = {
      secret: 'Completely secret - only a small group knows',
      limited: 'Limited - available to elites and rulers',
      public: 'Fully public - everyone has access'
    };

    const userPrompt = `Change: ${change}\nLocation: ${location}\nEra: ${era}\nMagnitude: ${magnitudeMap[magnitude as keyof typeof magnitudeMap]}\n\nGenerate 4 checkpoints in JSON.`;

    const zai = await ZAI.create();
    let result = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const responseText = await callLLM(zai, SYSTEM_PROMPT, userPrompt);
        if (!responseText) continue;
        const parsed = repairTruncatedJSON(responseText);
        if (parsed && validateCheckpoints(parsed)) {
          result = parsed;
          break;
        }
        console.error(`Attempt ${attempt}: parse failed.`, responseText.substring(0, 300));
      } catch (e) {
        console.error(`Attempt ${attempt} error:`, e);
      }
    }

    let checkpoints = result?.checkpoints || getFallbackCheckpoints(era, location, change);
    let usedFallback = !result;

    // Image generation (non-critical, 25s timeout)
    let generatedImage: string | null = null;
    if (!usedFallback) {
      const lastCp = checkpoints[checkpoints.length - 1];
      if (lastCp?.image_prompt) {
        try {
          const imgPromise = zai.images.generations.create({
            prompt: `Epic cinematic concept art, historical fantasy, dramatic lighting: ${lastCp.image_prompt}`,
            size: '1024x576',
          });
          const timeoutP = new Promise<null>((r) => setTimeout(() => r(null), 25000));
          const imgResult = await Promise.race([imgPromise, timeoutP]);
          if (imgResult?.data?.[0]?.base64) generatedImage = imgResult.data[0].base64;
        } catch (e) {
          console.error('Image gen failed:', e);
        }
      }
    }

    // Normalize: ensure every checkpoint has all required fields
    checkpoints = checkpoints.map((cp: any) => ({
      year: cp.year || 'Unknown',
      era_label: cp.era_label || 'Unknown Era',
      achievements: Array.isArray(cp.achievements) ? cp.achievements : [],
      crises: Array.isArray(cp.crises) ? cp.crises : [],
      world_state: cp.world_state || 'The world changed in ways we cannot fully describe.',
      geography: cp.geography || '',
      image_prompt: cp.image_prompt || '',
    }));

    return NextResponse.json({ success: true, checkpoints, featured_image: generatedImage });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Simulation failed' },
      { status: 500 }
    );
  }
}
