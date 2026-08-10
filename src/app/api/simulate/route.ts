import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SimulationRequest {
  era: string;
  location: string;
  change: string;
  magnitude: 'secret' | 'limited' | 'public';
}

const SYSTEM_PROMPT = `You are an alternative history AI. Create 4 timeline checkpoints spanning 800 years after a historical change.

CRITICAL: Keep responses EXTREMELY SHORT. Max 8 words per field, max 2 items per array.
image_prompt: max 15 English words.
All text in Persian except image_prompt (English).
Output ONLY raw JSON. No markdown. No explanation.

FORMAT:
{"checkpoints":[{"year":"500 BC","era_label":"short title","achievements":["item1"],"crises":["item1"],"world_state":"one short sentence","geography":"one short sentence","image_prompt":"English visual description"}]}

Exactly 4 checkpoints.`;

function repairTruncatedJSON(text: string): any | null {
  let cleaned = text.trim();

  // Remove markdown code blocks
  const cb = cleaned.match(/\x60\x60\x60(?:json)?\s*\n?([\s\S]*?)\n?\s*\x60\x60\x60/);
  if (cb) cleaned = cb[1].trim();

  // Find JSON boundaries
  const start = cleaned.indexOf('{');
  if (start === -1) return null;

  let json = cleaned.substring(start);

  // Try direct parse first
  try { return JSON.parse(json); } catch {}

  // Fix trailing commas
  json = json.replace(/,\s*([\]\}])/g, '$1');
  try { return JSON.parse(json); } catch {}

  // JSON is likely truncated - repair it
  // Step 1: Close any unclosed strings
  let inString = false;
  let escaped = false;
  let lastQuoteIdx = -1;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') {
      inString = !inString;
      lastQuoteIdx = i;
    }
  }
  
  // If we're inside a string, close it
  let repaired = json;
  if (inString) {
    // Remove the truncated string value and its key
    // Find the last complete key-value pair before the truncation
    repaired = json.substring(0, lastQuoteIdx + 1);
    // We need to remove the incomplete key-value pair
    // Find the pattern: ,"key":"incomplete value
    const lastCommaBeforeString = repaired.lastIndexOf(',', lastQuoteIdx);
    // Don't go before the opening { of the current object
    const lastObjOpen = repaired.lastIndexOf('{', lastQuoteIdx);
    if (lastCommaBeforeString > lastObjOpen) {
      repaired = repaired.substring(0, lastCommaBeforeString);
    } else {
      // The string is the first value in this object, just close after {
      repaired = repaired.substring(0, lastObjOpen + 1);
    }
  }

  // Step 2: Count and close brackets/braces
  let openBraces = 0, closeBraces = 0;
  let openBrackets = 0, closeBrackets = 0;
  for (const ch of repaired) {
    if (ch === '{') openBraces++;
    else if (ch === '}') closeBraces++;
    else if (ch === '[') openBrackets++;
    else if (ch === ']') closeBrackets++;
  }

  // Close in reverse order: ] then }
  while (closeBrackets < openBrackets) { repaired += ']'; closeBrackets++; }
  while (closeBraces < openBraces) { repaired += '}'; closeBraces++; }

  // Remove trailing commas again
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
      era_label: 'نقطه انشعاب',
      achievements: [change, 'شروع موج تغییرات'],
      crises: ['مقاومت در برابر تغییر'],
      world_state: `در ${location}، ${change} و جهان تغییر کرد.`,
      geography: `${location} کانون تحولات شد.`,
      image_prompt: `Ancient city of ${location}, golden hour, cinematic concept art`
    },
    {
      year: '+200 سال',
      era_label: 'گسترش تغییر',
      achievements: ['توسعه فناوری', 'شبکه‌های جدید'],
      crises: ['جنگ منابع'],
      world_state: 'تغییرات به همسایه‌ها سرایت کرد.',
      geography: 'مرزها تغییر کرد.',
      image_prompt: 'Medieval city with advanced technology, oil painting, dramatic'
    },
    {
      year: '+500 سال',
      era_label: 'عصر جدید',
      achievements: ['پیشرفت علمی', 'تمدن جدید'],
      crises: ['بحران زیست‌محیطی'],
      world_state: 'تمدن متفاوتی شکل گرفت.',
      geography: 'قدرت‌های جدید ظهور کردند.',
      image_prompt: 'Futuristic ancient city, dramatic sunset, concept art, 8K'
    },
    {
      year: '+800 سال',
      era_label: 'برآیند نهایی',
      achievements: ['جهان متحول', 'دستاوردهای بزرگ'],
      crises: ['چالش‌های اخلاقی'],
      world_state: 'پس از ۸۰۰ سال جهان جای متفاوتی شد.',
      geography: 'نقشه جهان تغییر کرد.',
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

  if (completion?.choices?.[0]?.message?.content) {
    return completion.choices[0].message.content;
  } else if (typeof completion === 'string') {
    return completion;
  } else if (completion?.output?.text) {
    return completion.output.text;
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();
    const { era, location, change, magnitude } = body;

    const magnitudeMap = {
      secret: 'مخفیانه',
      limited: 'محدود - در اختیار حاکمان',
      public: 'عمومی - همه مردم'
    };

    const userPrompt = `Change: ${change}\nLocation: ${location}\nEra: ${era}\nMagnitude: ${magnitudeMap[magnitude]}\n\n4 checkpoints in JSON.`;

    const zai = await ZAI.create();

    // Try up to 2 times
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
        console.error(`Attempt ${attempt}: parse failed. Raw:`, responseText.substring(0, 300));
      } catch (llmError) {
        console.error(`Attempt ${attempt} error:`, llmError);
      }
    }

    let checkpoints = result?.checkpoints || getFallbackCheckpoints(era, location, change);
    let usedFallback = !result;

    // Generate image (non-critical, 25s timeout)
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

    return NextResponse.json({
      success: true,
      checkpoints,
      featured_image: generatedImage,
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'خطایی در شبیه‌سازی رخ داد' },
      { status: 500 }
    );
  }
}
