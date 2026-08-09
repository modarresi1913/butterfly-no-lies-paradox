import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SimulationRequest {
  era: string;
  location: string;
  change: string;
  magnitude: 'secret' | 'limited' | 'public';
}

const SYSTEM_PROMPT = `تو محقق تاریخ جایگزین پلتفرم «The Butterfly Effect» هستی. وظیفه تو این است که بر اساس یک تغییر کوچک در تاریخ، زنجیره علت‌ومعلولی منطقی را تحلیل کنی و خط زمانی جدیدی را تصویر کنی.

قواعد اصلی:
1. تغییرات باید منطقی و علی‌مبتنی باشند (نه خنده‌دار، نه خسته‌کننده)
2. تقارن تاریخی را رعایت کن (مثلاً اگر کاغذ نبود، ماشین چاپ کار نمی‌کند)
3. هر 100-200 سال یک ایستگاه بساز
4. توانایی‌ها و بحران‌ها باید خلاقانه و شگفت‌انگیز باشند
5. پاسخ حتماً به صورت JSON باشد

فرمت JSON مورد نیاز:
{
  "checkpoints": [
    {
      "year": "1200 BC",
      "era_label": "سال 0 - نقطه عطف",
      "achievements": ["دستاورد 1", "دستاورد 2"],
      "crises": ["بحران 1"],
      "world_state": "توضیح مستقیم وضعیت جهان",
      "geography": "تغییرات جغرافیایی",
      "image_prompt": "English prompt for AI image generation of the most important city in this era"
    }
  ]
}

تعداد checkpoints: حدود 5 ایستگاه (هر 100-200 سال یک توقف) بساز.
image_prompt حتماً باید به زبان انگلیسی باشد و شامل تفصیلات بصری باشد.
همه متن‌های فارسی باید روان، داستانی و جذاب باشند.
فقط خروجی JSON را بده. هیچ متن اضافی قبل و بعد از JSON ننویس.`;

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

خط زمانی جدید را از این نقطه عطف شروع کن و حدود 5 ایستگاه 100-200 ساله تا 1000 سال بعد را توصیف کن.`;

    const zai = await ZAI.create();

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

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const simulationResult = JSON.parse(jsonMatch[0]);

    const lastCheckpoint = simulationResult.checkpoints[simulationResult.checkpoints.length - 1];
    let generatedImage: string | null = null;

    if (lastCheckpoint?.image_prompt) {
      try {
        const imageResult = await zai.images.generations.create({
          prompt: `Epic cinematic scene, dramatic lighting, ultra detailed, concept art style, historical fantasy: ${lastCheckpoint.image_prompt}. ArtStation quality, 8K resolution, volumetric lighting, epic composition.`,
          size: '1344x768',
        });
        if (imageResult?.data?.[0]?.base64) {
          generatedImage = imageResult.data[0].base64;
        }
      } catch (imageError) {
        console.error('Image generation failed:', imageError);
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
