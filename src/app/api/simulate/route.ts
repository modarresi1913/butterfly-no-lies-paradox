import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SimulationRequest {
  era: string;
  location: string;
  change: string;
  magnitude: 'secret' | 'limited' | 'public';
}

interface Checkpoint {
  year: string;
  era_label: string;
  achievements: string[];
  crises: string[];
  world_state: string;
  geography: string;
  image_prompt: string;
}

const SYSTEM_PROMPT = `You are the alternative history researcher for "The Butterfly Effect" platform. Your job is to analyze a small change in history and create a logical cause-and-effect timeline.

RULES:
1. Changes must be logical and causal (not ridiculous, not boring)
2. Maintain historical symmetry (e.g., if paper didn't exist, printing press won't work)
3. Create one station every 100-200 years
4. Achievements and crises must be creative and surprising
5. You MUST respond ONLY with valid JSON - no markdown, no code blocks, no extra text

REQUIRED JSON FORMAT (respond in Persian/Farsi for all text fields EXCEPT image_prompt which must be in English):
{
  "checkpoints": [
    {
      "year": "1200 BC",
      "era_label": "سال 0 - نقطه عطف",
      "achievements": ["دستاورد 1", "دستاورد 2", "دستاورد 3"],
      "crises": ["بحران 1", "بحران 2"],
      "world_state": "توضیح مستقیم وضعیت جهان در این دوره",
      "geography": "تغییرات جغرافیایی و سیاسی",
      "image_prompt": "English prompt for AI image generation describing the most important city"
    }
  ]
}

Create exactly 5 checkpoints spanning 1000 years from the point of divergence.
image_prompt MUST be in English with rich visual details for image generation.
All other text MUST be in Persian/Farsi - make it narrative, engaging and vivid.
RESPOND WITH RAW JSON ONLY. No \`\`\`json markers, no explanations, no extra text.`;

function extractJSON(text: string): string | null {
  // Try 1: Remove markdown code blocks if present
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // Try 2: Direct parse
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {}

  // Try 3: Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {}
  }

  // Try 4: Fix common JSON issues (trailing commas, single quotes)
  let fixed = cleaned;
  fixed = fixed.replace(/,\s*([}\]])/g, '$1'); // trailing commas
  fixed = fixed.replace(/'/g, '"'); // single quotes
  
  const firstB = fixed.indexOf('{');
  const lastB = fixed.lastIndexOf('}');
  if (firstB !== -1 && lastB > firstB) {
    const candidate = fixed.substring(firstB, lastB + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {}
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();
    const { era, location, change, magnitude } = body;

    const magnitudeMap = {
      secret: 'تغییر کاملاً مخفیانه - فقط یک گروه کوچک از آن آگاه است',
      limited: 'تغییر محدود - در اختیار الیت و حاکمان قرار دارد',
      public: 'تغییر کاملاً عمومی - تمام مردم به آن دسترسی دارند'
    };

    const userPrompt = `سناریوی تاریخ جایگزین:

- زمان: ${era}
- مکان: ${location}
- تغییر: ${change}
- شدت: ${magnitudeMap[magnitude]}

خط زمانی جدید را از این نقطه عطف شروع کن و دقیقاً 5 ایستگاه 100-200 ساله تا 1000 سال بعد را توصیف کن.`;

    const zai = await ZAI.create();

    // Step 1: Generate timeline via LLM
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      stream: false,
    });

    let responseText = '';
    if (completion?.choices?.[0]?.message?.content) {
      responseText = completion.choices[0].message.content;
    } else if (typeof completion === 'string') {
      responseText = completion;
    } else if (completion?.output?.text) {
      responseText = completion.output.text;
    }

    if (!responseText) {
      throw new Error('هوش مصنوعی پاسخی تولید نکرد. لطفاً دوباره تلاش کنید.');
    }

    // Parse JSON with robust extraction
    const jsonStr = extractJSON(responseText);
    if (!jsonStr) {
      console.error('Failed to parse AI response:', responseText.substring(0, 500));
      throw new Error('پاسخ هوش مصنوعی قابل پردازش نبود. لطفاً دوباره تلاش کنید.');
    }

    const simulationResult = JSON.parse(jsonStr);

    if (!simulationResult.checkpoints || !Array.isArray(simulationResult.checkpoints) || simulationResult.checkpoints.length === 0) {
      throw new Error('فرمت پاسخ نامعتبر بود. لطفاً دوباره تلاش کنید.');
    }

    // Step 2: Generate image for last checkpoint (non-blocking, with timeout)
    const lastCheckpoint = simulationResult.checkpoints[simulationResult.checkpoints.length - 1];
    let generatedImage: string | null = null;

    if (lastCheckpoint?.image_prompt) {
      try {
        const imagePromise = zai.images.generations.create({
          prompt: `Epic cinematic scene, dramatic lighting, ultra detailed, concept art style, historical fantasy: ${lastCheckpoint.image_prompt}. ArtStation quality, 8K resolution, volumetric lighting, epic composition.`,
          size: '1024x576',
        });
        
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 30000)
        );
        
        const imageResult = await Promise.race([imagePromise, timeoutPromise]);
        if (imageResult && imageResult?.data?.[0]?.base64) {
          generatedImage = imageResult.data[0].base64;
        }
      } catch (imageError) {
        console.error('Image generation failed (non-critical):', imageError);
      }
    }

    return NextResponse.json({
      success: true,
      checkpoints: simulationResult.checkpoints,
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
