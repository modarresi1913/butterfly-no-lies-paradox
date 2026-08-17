'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Globe,
  Clock,
  ChevronRight,
  Play,
  Loader2,
  Trophy,
  AlertTriangle,
  Sparkles,
  Eye,
  Lock,
  Users,
  RotateCcw,
  ArrowLeft,
  Sword,
  FlaskConical,
  BookOpen,
  Landmark,
  Palette,
  Ship,
  Brain,
  Heart,
  Scale,
  Rocket,
  MessageCircle,
  ArrowDown,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─── Types ─────────────────────────────────────────────
type Magnitude = 'secret' | 'limited' | 'public';
type Step = 'idle' | 'ripple' | 'magnitude' | 'simulate' | 'results' | 'explore';

interface Checkpoint {
  year: string;
  era_label: string;
  achievements: string[];
  crises: string[];
  world_state: string;
  geography: string;
  image_prompt: string;
}

// ─── Pre-built Scenarios ────────────────────────────────
const SCENARIOS = [
  {
    era: '1026 AD',
    location: 'Medieval Europe & Middle East',
    change: 'Complete removal of the concept of lying from human biology and psychology — humans can no longer intend to deceive',
    magnitude: 'public' as Magnitude,
    featured: true,
    tag: 'The No-Lies Paradox',
  },
  {
    era: '500 BC',
    location: 'Ancient Iran - Persepolis',
    change: 'Invention of the printing press by Cyrus the Great',
    magnitude: 'public' as Magnitude,
    tag: 'Knowledge Dawn',
  },
  {
    era: '1200 BC',
    location: 'Ancient Egypt - Cairo',
    change: 'Invention of the battery and early electric lamps',
    magnitude: 'limited' as Magnitude,
    tag: 'Electric Dawn',
  },
  {
    era: '330 BC',
    location: 'Ancient Greece - Athens',
    change: 'Discovery of atomic energy by Aristotle',
    magnitude: 'secret' as Magnitude,
    tag: 'Atomic Antiquity',
  },
];

const ERA_SUGGESTIONS = [
  '3000 BC', '2500 BC', '1200 BC', '800 BC',
  '500 BC', '330 BC', '100 BC',
  '100 AD', '500 AD', '800 AD', '1200 AD', '1500 AD',
];

const LOCATION_SUGGESTIONS = [
  'Ancient Iran - Persepolis',
  'Ancient Egypt - Cairo',
  'Ancient Greece - Athens',
  'Ancient Rome',
  'Ancient China - Beijing',
  'Ancient India',
  'Mesopotamia - Babylon',
  'Ottoman Empire - Istanbul',
  'Medieval Europe',
  'Ancient Japan - Kyoto',
];

const MAGNITUDE_OPTIONS: {
  value: Magnitude;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'secret',
    label: 'Secret',
    description: 'Only a small group knows about the change',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    value: 'limited',
    label: 'Limited',
    description: 'Available to elites and rulers only',
    icon: <Eye className="w-5 h-5" />,
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Everyone has access to the change',
    icon: <Users className="w-5 h-5" />,
  },
];

// ─── No-Lies Deep Dive Data ───────────────────────────
const DIMENSIONS = [
  {
    id: 'politics',
    title: 'فروپاشی نظام‌های سیاسی',
    titleEn: 'Political Collapse',
    icon: <Landmark className="w-5 h-5" />,
    color: 'rose' as const,
    summary: 'پادشاهان و کلیسا با «حق الهی» حکومت می‌کردند. با حذف دروغ، دیگر هیچ پادشاهی نمیتوانست ادعا کند خدا مرا برگزیده مگر اینکه واقعاً صداهایی بشنود.',
    keyPoints: [
      'شاهان مجبور به اعلام ضعف‌های اقتصادی خود',
      'قراردادهای مخفی و معاهدات پشت پرده غیرممکن',
      'جنگها فقط بر سر منابع آشکار (آب، زمین، غذا)',
      'عصر تاریکی ۵۰۰ سال زودتر به پایان میرسد',
    ],
    quote: 'ما برای غارت ثروت و قدرت شخصی آمده‌ایم — کریستف کلمب در این دنیا',
  },
  {
    id: 'science',
    title: 'انفجار علمی بیسابقه',
    titleEn: 'Scientific Explosion',
    icon: <FlaskConical className="w-5 h-5" />,
    color: 'cyan' as const,
    summary: 'بزرگترین مانع پیشرفت علمی، تعصب مبتنی بر دروغهای مصلحتی و جعل دادهها بوده. کپلر و گالیله نیازی به ترس از تفتیش عقاید ندارند.',
    keyPoints: [
      'انقلاب صنعتی در قرن ۱۳ میلادی',
      'نظریه تکامل و ژنتیک تا سال ۱۵۰۰',
      'مقالات علمی جعلی هرگز منتشر نمیشوند',
      'دانشمندان یافته‌های شکست‌خورده را صادقانه منتشر می‌کنند',
    ],
    quote: 'تفسیرهای من اشتباه بود — پاپ در این دنیا',
  },
  {
    id: 'religion',
    title: 'بحران وجودی ادیان',
    titleEn: 'Religious Crisis',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'amber' as const,
    summary: 'ادیان ابراهیمی با چالشی مرگبار مواجه میشوند. اگر کشیش یا ملا نتواند بگوید این کلام خداست مگر اینکه شک داشته باشد، دین به دو شاخه تقسیم میشود.',
    keyPoints: [
      'شاخه عرفانی: گزارش حس شخصی (نه ادعای حقیقت مطلق)',
      'شاخه فلسفی: اخلاق صرف بدون استدلال متافیزیکی',
      'جنگهای صلیبی هرگز رخ نمیدهند',
      'خاورمیانه و اروپا به جای دشمنی مذهبی، تعامل اقتصادی شفاف',
    ],
    quote: 'من فقط احساس می‌کنم خدا هست — راهب صادق',
  },
  {
    id: 'economy',
    title: 'فروپاشی اقتصاد اعتباری',
    titleEn: 'Credit Economy Collapse',
    icon: <Scale className="w-5 h-5" />,
    color: 'emerald' as const,
    summary: 'وامهای بانکی، بیمه و بازار بورس بر پایه اعتماد به وعده آینده استوارند. هیچکس نمیتواند بدهی خود را انکار کند یا قسط خوشبینانه بدهد.',
    keyPoints: [
      'حباب اقتصادی (لاله هلند، بحران ۲۰۰۸) به کلی از بین میرود',
      'فروشنده: این لاله‌ها فقط پیاز هستند و ارزش ذاتی ندارند!',
      'سرمایه‌گذاری کاهش اما هرگز ورشکستگی زنجیرهای',
      'بازگشت به مبادله کالا به کالا و قراردادهای ریسک صریح',
    ],
    quote: 'این لاله‌ها فقط پیاز هستند — فروشنده هلندی در این دنیا',
  },
  {
    id: 'art',
    title: 'تحول ادبیات و هنر',
    titleEn: 'Art & Literature',
    icon: <Palette className="w-5 h-5" />,
    color: 'cyan' as const,
    summary: 'رمان و فیلم دروغ محسوب نمیشوند چون با قرارداد تخیل همراهاند. اما تظاهر و رو در وایسی از بین میرود.',
    keyPoints: [
      'ادبیات به سمت اتوبیوگرافی محض و شعر عریان عاطفی',
      'شخصیتپردازی ضدقهرمان (هملت، راسکولنیکف) هرگز خلق نمیشود',
      'هنر به کاوش تضادهای درونی بدون ریا',
      'طنز از بین میرود — چون بر پایه انتظار غلط است',
    ],
    quote: 'من ۷۰٪ attracted به تو هستم، ۳۰٪ به خاطر تنهایی — عاشق در این دنیا',
  },
  {
    id: 'geopolitics',
    title: 'استعمار صریح و سیاست بین‌الملل',
    titleEn: 'Transparent Colonialism',
    icon: <Ship className="w-5 h-5" />,
    color: 'amber' as const,
    summary: 'وقتی کریستف کلمب به سرزمینی جدید میرسد، نمیتواند بگوید برای گسترش تمدن آمده. مجبور است بگوید برای بردهداری و غارت طلا آمده.',
    keyPoints: [
      'بومیان هشدار داده شده و با تمام توان میجنگند',
      'نژادپرستی علمی هرگز شکل نمیگیرد',
      'دانشمندان نمیتوانند دادهها را برای برتری نژاد سفید جعل کنند',
      'سیاستمداران وجود ندارند — جای آنها مدیران اجرایی هستند',
    ],
    quote: 'ما برای بردهداری و غارت طلا آمده‌ایم — فاتح در این دنیا',
  },
];

const COMPARISON_DATA = [
  {
    field: 'علم و تکنولوژی',
    icon: <FlaskConical className="w-4 h-4" />,
    ours: 'هوش مصنوعی، CRISPR، اینترنت',
    theirs: 'colonisation مریخ، عمر ۱۵۰ ساله، هوش جمعی',
    advantage: 'them',
  },
  {
    field: 'سیاست و حکومت',
    icon: <Landmark className="w-4 h-4" />,
    ours: 'دموکراسی ناکارآمد، پروپاگاندا',
    theirs: 'سیستم فنی-مدیریتی بدون انتخابات احساسی',
    advantage: 'them',
  },
  {
    field: 'هنر و ادبیات',
    icon: <Palette className="w-4 h-4" />,
    ours: 'رمان، فیلم، تئاتر، طنز',
    theirs: 'شعر تجربه‌محور، مستند، موسیقی ابسترکت',
    advantage: 'ours',
  },
  {
    field: 'جنگ و درگیری',
    icon: <Sword className="w-4 h-4" />,
    ours: 'جنگهای نیابتی، پروپاگاندا، تروریسم',
    theirs: 'جنگهای نادر اما ویرانگر و شفاف',
    advantage: 'neutral',
  },
  {
    field: 'اقتصاد',
    icon: <Scale className="w-4 h-4" />,
    ours: 'بازار سرمایه، حباب، بحران مکرر',
    theirs: 'اقتصاد مبادله‌ای پایدار اما کند',
    advantage: 'neutral',
  },
  {
    field: 'سلامت روان',
    icon: <Brain className="w-4 h-4" />,
    ours: 'افسردگی ~۲۰٪، دروغ سفید آرامشبخش',
    theirs: 'افسردگی ~۳۵٪، حقیقت بی‌رحمانه',
    advantage: 'ours',
  },
  {
    field: 'دین و معنویت',
    icon: <BookOpen className="w-4 h-4" />,
    ours: 'دین نهادی، جنگهای مذهبی',
    theirs: 'عرفان شخصی، فلسفه اخلاقی',
    advantage: 'them',
  },
  {
    field: 'عشق و روابط',
    icon: <Heart className="w-4 h-4" />,
    ours: 'عشق رمانتیک، ایده‌آل‌سازی، طلاق بالا',
    theirs: 'روابط استوارتر اما کمتر عاشقانه',
    advantage: 'ours',
  },
];

const PLOT_TWIST = {
  title: 'پیچیدگی نهایی',
  titleEn: 'The Plot Twist',
  text: 'اگر فقط گفتار صادق باشد اما سکوت و حذف عمدی بخشی از واقعیت مجاز باشد، بشریت بهسرعت زبان حقیقت ناقص را ابداع می‌کند. برای سناریوی شگفتانگیز، باید فرض کنیم قصد فریب به کلی از مغز انسان پاک شده — انسان حتی نمیتواند فکر کند که چیزی را پنهان کند.',
  punchline: 'ما هزار سال زودتر به ماه میرسیدیم، اما در طول سفر، فضانوردان مدام به هم میگفتند: بوی عرق تو واقعاً وحشتناک است!',
};

// ─── Butterfly SVG Component ───────────────────────────
function ButterflyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 20 C30 0, 0 10, 10 40 C15 55, 35 50, 50 45"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M50 20 C70 0, 100 10, 90 40 C85 55, 65 50, 50 45"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M50 45 C35 50, 20 70, 30 85 C35 92, 45 80, 50 65"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M50 45 C65 50, 80 70, 70 85 C65 92, 55 80, 50 65"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <line
        x1="50" y1="15"
        x2="50" y2="90"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Background Particles ──────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) * 1.03,
  y: ((i * 53 + 7) % 89) * 1.12,
  size: ((i * 17 + 3) % 3) + 1,
  delay: ((i * 23 + 11) % 50) * 0.1,
  duration: ((i * 19 + 5) % 10) + 10,
}));

function ParticleField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}

// ─── Step Indicator ────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: 'ripple' as Step, label: 'The Ripple', icon: <Zap className="w-4 h-4" /> },
    { key: 'magnitude' as Step, label: 'Magnitude', icon: <Globe className="w-4 h-4" /> },
    { key: 'simulate' as Step, label: 'Simulate', icon: <Play className="w-4 h-4" /> },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-2 md:gap-4">
            <motion.div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber/15 text-amber border border-amber/30'
                  : isDone
                  ? 'bg-emerald/10 text-emerald border border-emerald/30'
                  : 'bg-secondary/50 text-muted-foreground border border-border/30'
              }`}
              animate={isActive ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isDone ? <Sparkles className="w-3.5 h-3.5" /> : step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-px ${isDone ? 'bg-emerald/40' : 'bg-border/30'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── The Ripple Step ───────────────────────────────────
function RippleStep({
  data,
  onChange,
  onNext,
}: {
  data: { era: string; location: string; change: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);

  const isValid = data.era.trim() && data.location.trim() && data.change.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-amber text-sm mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-3.5 h-3.5" />
          Step 1 of 3
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Choose Your Turning Point
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Pick a time, place, and a small change to set chaos in motion
        </p>
      </div>

      {/* Quick Scenarios */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground px-1">Suggested scenarios:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={i}
              className={`text-right p-3 rounded-lg border text-left transition-all ${
                data.era === s.era && data.location === s.location
                  ? 'border-amber/50 bg-amber/10'
                  : 'border-border/50 bg-card/30 hover:border-amber/30'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onChange('era', s.era);
                onChange('location', s.location);
                onChange('change', s.change);
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                {'tag' in s && s.tag && (
                  <Badge className="bg-amber/15 text-amber border-amber/30 text-[9px] px-1.5 py-0">{s.tag}</Badge>
                )}
                <p className="text-xs font-medium truncate">{s.change.substring(0, 60)}{s.change.length > 60 ? '...' : ''}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {s.era} &bull; {s.location}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Era */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber" />
              Time Period
            </label>
            <div className="relative">
              <Input
                value={data.era}
                onChange={(e) => onChange('era', e.target.value)}
                onFocus={() => setShowSuggestions('era')}
                onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                placeholder="e.g., 500 BC"
                className="text-left"
              />
              {showSuggestions === 'era' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                  {ERA_SUGGESTIONS.filter((e) =>
                    !data.era || e.toLowerCase().includes(data.era.toLowerCase())
                  ).map((e) => (
                    <button
                      key={e}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                      onMouseDown={() => { onChange('era', e); setShowSuggestions(null); }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan" />
              Location
            </label>
            <div className="relative">
              <Input
                value={data.location}
                onChange={(e) => onChange('location', e.target.value)}
                onFocus={() => setShowSuggestions('location')}
                onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                placeholder="e.g., Ancient Rome"
                className="text-left"
              />
              {showSuggestions === 'location' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                  {LOCATION_SUGGESTIONS.filter((l) =>
                    !data.location || l.toLowerCase().includes(data.location.toLowerCase())
                  ).map((l) => (
                    <button
                      key={l}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                      onMouseDown={() => { onChange('location', l); setShowSuggestions(null); }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Change */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald" />
              The Change (the small ripple that transforms history)
            </label>
            <Textarea
              value={data.change}
              onChange={(e) => onChange('change', e.target.value)}
              placeholder="e.g., Invention of the printing press by Cyrus the Great"
              className="text-left min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-amber hover:bg-amber-dark text-black font-medium px-6 gap-2"
        >
          Next Step
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── The Magnitude Step ────────────────────────────────
function MagnitudeStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Magnitude;
  onChange: (v: Magnitude) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-sm mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Globe className="w-3.5 h-3.5" />
          Step 2 of 3
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          How Big Is the Ripple?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          How secret or public was this change?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MAGNITUDE_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              className={`relative text-center p-5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-amber bg-amber/10 shadow-lg shadow-amber/10'
                  : 'border-border/50 bg-card/50 hover:border-amber/30'
              }`}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(opt.value)}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-amber"
                  layoutId="magnitude-ring"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={`mb-3 inline-flex p-3 rounded-full ${
                  isSelected ? 'bg-amber/20 text-amber' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {opt.icon}
              </div>
              <h3 className="font-bold text-lg mb-1">{opt.label}</h3>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-amber hover:bg-amber-dark text-black font-medium px-6 gap-2"
        >
          Simulate!
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Simulation Loading ────────────────────────────────
function SimulationLoading() {
  const messages = [
    'Analyzing history...',
    'Calculating cause & effect chains...',
    'Building alternate timeline...',
    'Rendering visions...',
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto text-center space-y-6 py-20"
    >
      <div className="relative w-32 h-32 mx-auto">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-amber/30"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeInOut',
            }}
          />
        ))}
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center text-amber"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ButterflyIcon className="w-20 h-20" />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg text-amber font-medium"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>

      <div className="w-48 h-1 mx-auto bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber to-cyan rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

// ─── Timeline Checkpoint Card ──────────────────────────
function CheckpointCard({
  checkpoint,
  index,
  total,
  isBranchPoint,
}: {
  checkpoint: Checkpoint;
  index: number;
  total: number;
  isBranchPoint: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.3, duration: 0.5 }}
      className="relative flex gap-4 md:gap-6"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 z-10 ${
            isBranchPoint
              ? 'border-amber bg-amber/20 text-amber'
              : 'border-cyan/50 bg-cyan/10 text-cyan'
          }`}
          whileHover={{ scale: 1.15 }}
        >
          {isBranchPoint ? (
            <Zap className="w-5 h-5" />
          ) : (
            <span className="text-xs font-bold">{index}</span>
          )}
        </motion.div>
        {index < total - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-amber/30 via-cyan/20 to-transparent min-h-[40px]" />
        )}
      </div>

      {/* Content Card */}
      <motion.div
        className={`flex-1 mb-6 md:mb-8 rounded-xl border overflow-hidden ${
          isBranchPoint
            ? 'border-amber/30 bg-amber/5'
            : 'border-border/50 bg-card/50'
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div
          className={`px-4 py-3 border-b ${
            isBranchPoint ? 'border-amber/20 bg-amber/10' : 'border-border/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base md:text-lg">
                {checkpoint.era_label}
              </h3>
              <p className="text-xs text-muted-foreground">{checkpoint.year}</p>
            </div>
            {isBranchPoint && (
              <Badge className="bg-amber/20 text-amber border-amber/30">
                Branch Point
              </Badge>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {checkpoint.world_state}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Achievements */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald text-xs font-medium">
                <Trophy className="w-3.5 h-3.5" />
                Achievements
              </div>
              {(checkpoint.achievements || []).slice(0, expanded ? undefined : 2).map((a: string, i: number) => (
                <p key={i} className="text-xs text-muted-foreground pl-4">
                  &bull; {a}
                </p>
              ))}
              {(checkpoint.achievements || []).length > 2 && !expanded && (
                <button
                  className="text-xs text-amber/70 hover:text-amber pl-4"
                  onClick={() => setExpanded(true)}
                >
                  +{(checkpoint.achievements || []).length - 2} more
                </button>
              )}
            </div>

            {/* Crises */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Crises
              </div>
              {(checkpoint.crises || []).slice(0, expanded ? undefined : 2).map((c: string, i: number) => (
                <p key={i} className="text-xs text-muted-foreground pl-4">
                  &bull; {c}
                </p>
              ))}
              {(checkpoint.crises || []).length > 2 && !expanded && (
                <button
                  className="text-xs text-amber/70 hover:text-amber pl-4"
                  onClick={() => setExpanded(true)}
                >
                  +{(checkpoint.crises || []).length - 2} more
                </button>
              )}
            </div>
          </div>

          {/* Geography */}
          {checkpoint.geography && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/50">
              <Globe className="w-3.5 h-3.5 text-cyan shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {checkpoint.geography}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Results View ──────────────────────────────────────
function ResultsView({
  checkpoints,
  featuredImage,
  onReset,
  inputData,
}: {
  checkpoints: Checkpoint[];
  featuredImage: string | null;
  onReset: () => void;
  inputData: { era: string; location: string; change: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald/30 bg-emerald/10 text-emerald text-sm mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Simulation Complete
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          New Timeline
        </h2>
        <p className="text-muted-foreground text-sm">
          {inputData.change} &mdash; {inputData.era} &mdash; {inputData.location}
        </p>
      </div>

      {/* Branching Indicator */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber/20 bg-amber/5">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald animate-ripple" />
          </div>
          <div className="flex-1">
            <div className="h-px bg-gradient-to-r from-emerald via-cyan to-amber" />
          </div>
          <div className="text-xs text-muted-foreground">Original</div>
          <ChevronRight className="w-4 h-4 text-amber" />
          <div className="text-xs text-amber font-medium">Alternate</div>
          <div className="w-3 h-3 rounded-full bg-amber" />
        </div>
      </div>

      {/* Featured Image */}
      <AnimatePresence>
        {featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-xl overflow-hidden border border-border/50"
          >
            <img
              src={`data:image/png;base64,${featuredImage}`}
              alt="AI-rendered vision of the alternate world"
              className="w-full h-auto"
            />
            <div className="p-3 bg-card/80 text-center">
              <p className="text-xs text-muted-foreground">
                AI-rendered vision of the most important city in the new timeline
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Checkpoints */}
      <div className="space-y-0 custom-scrollbar max-h-[70vh] overflow-y-auto px-2 pb-8">
        {checkpoints.map((cp, i) => (
          <CheckpointCard
            key={i}
            checkpoint={cp}
            index={i}
            total={checkpoints.length}
            isBranchPoint={i === 0}
          />
        ))}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2 border-amber/30 hover:bg-amber/10 hover:text-amber"
        >
          <RotateCcw className="w-4 h-4" />
          New Simulation
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Deep Dive: Dimension Card ────────────────────────
function DimensionCard({
  dimension,
  index,
  isActive,
  onClick,
}: {
  dimension: typeof DIMENSIONS[number];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    rose: { border: 'border-rose/30', bg: 'bg-rose/10', text: 'text-rose', glow: 'shadow-rose/10' },
    cyan: { border: 'border-cyan/30', bg: 'bg-cyan/10', text: 'text-cyan', glow: 'shadow-cyan/10' },
    amber: { border: 'border-amber/30', bg: 'bg-amber/10', text: 'text-amber', glow: 'shadow-amber/10' },
    emerald: { border: 'border-emerald/30', bg: 'bg-emerald/10', text: 'text-emerald', glow: 'shadow-emerald/10' },
  };
  const c = colorMap[dimension.color] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
        isActive
          ? `${c.border} ${c.bg} shadow-lg ${c.glow}`
          : 'border-border/50 bg-card/30 hover:border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 p-2 rounded-lg ${c.bg} ${c.text}`}>
          {dimension.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{dimension.title}</h3>
            <span className="text-[10px] text-muted-foreground font-mono">{dimension.titleEn}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {dimension.summary}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${isActive ? c.text : 'text-muted-foreground/40'}`} />
      </div>
    </motion.div>
  );
}

// ─── Deep Dive: Expanded Dimension ─────────────────────
function ExpandedDimension({ dimension }: { dimension: typeof DIMENSIONS[number] }) {
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    rose: { border: 'border-rose/20', bg: 'bg-rose/5', text: 'text-rose' },
    cyan: { border: 'border-cyan/20', bg: 'bg-cyan/5', text: 'text-cyan' },
    amber: { border: 'border-amber/20', bg: 'bg-amber/5', text: 'text-amber' },
    emerald: { border: 'border-emerald/20', bg: 'bg-emerald/5', text: 'text-emerald' },
  };
  const c = colorMap[dimension.color] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}
    >
      <div className="p-4 md:p-6 space-y-4">
        <p className="text-sm leading-relaxed text-foreground/90">{dimension.summary}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dimension.keyPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-xs"
            >
              <Zap className={`w-3 h-3 shrink-0 mt-0.5 ${c.text}`} />
              <span className="text-foreground/80">{point}</span>
            </motion.div>
          ))}
        </div>

        <div className={`flex items-start gap-2 p-3 rounded-lg border ${c.border} bg-background/30`}>
          <MessageCircle className={`w-4 h-4 shrink-0 mt-0.5 ${c.text}`} />
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">نقل قول از دنیای بدون دروغ:</p>
            <p className="text-xs text-foreground/90 italic leading-relaxed">{dimension.quote}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Deep Dive: Comparison Table ───────────────────────
function ComparisonTable() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/30 bg-secondary/30">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber" />
          دنیای ما در برابر دنیای بدون دروغ (۲۰۲۶ میلادی)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">حوزه</th>
              <th className="text-right px-4 py-2.5 text-rose font-medium">دنیای ما</th>
              <th className="text-right px-4 py-2.5 text-cyan font-medium">دنیای بدون دروغ</th>
              <th className="text-center px-3 py-2.5 text-muted-foreground font-medium">برتری</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors"
              >
                <td className="px-4 py-2.5 font-medium flex items-center gap-1.5">
                  <span className="text-muted-foreground">{row.icon}</span>
                  {row.field}
                </td>
                <td className="px-4 py-2.5 text-foreground/70">{row.ours}</td>
                <td className="px-4 py-2.5 text-foreground/70">{row.theirs}</td>
                <td className="px-3 py-2.5 text-center">
                  {row.advantage === 'ours' && (
                    <Badge className="bg-rose/15 text-rose border-rose/30 text-[10px] px-1.5 py-0">ما</Badge>
                  )}
                  {row.advantage === 'them' && (
                    <Badge className="bg-cyan/15 text-cyan border-cyan/30 text-[10px] px-1.5 py-0">بدون دروغ</Badge>
                  )}
                  {row.advantage === 'neutral' && (
                    <Badge className="bg-secondary text-muted-foreground border-border/50 text-[10px] px-1.5 py-0">مساوی</Badge>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Deep Dive: Plot Twist Section ─────────────────────
function PlotTwistSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-amber/20 bg-gradient-to-br from-amber/5 to-transparent overflow-hidden"
    >
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber" />
          <div>
            <h3 className="font-bold text-base">{PLOT_TWIST.title}</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{PLOT_TWIST.titleEn}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{PLOT_TWIST.text}</p>
        <div className="relative p-4 rounded-lg border border-amber/20 bg-amber/5">
          <div className="absolute top-2 left-2 text-amber/30 text-3xl font-serif">&ldquo;</div>
          <p className="text-sm text-amber font-medium italic leading-relaxed pl-4">
            {PLOT_TWIST.punchline}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Rocket className="w-3.5 h-3.5 text-emerald" />
          <p className="text-xs text-muted-foreground">
            پیشرفت فنی بیشتر + رفاه روانی کمتر = پارادوکس تمدن بدون دروغ
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Deep Dive: Full View ──────────────────────────────
function DeepDiveView({
  onBack,
  onSimulate,
}: {
  onBack: () => void;
  onSimulate: () => void;
}) {
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-amber text-sm mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Featured Scenario
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          پارادوکس{' '}
          <span className="text-amber">بدون دروغ</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
          اگر در سال ۱۰۲۶ میلادی، مفهوم «دروغ» به طور کامل از زیست‌شناسی انسان حذف می‌شد،
          تاریخ ۱۰۰۰ ساله بعدی چگونه بازنویسی می‌شد؟
        </p>
      </div>

      {/* Branching Indicator */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber/20 bg-amber/5">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald animate-ripple" />
          </div>
          <div className="flex-1">
            <div className="h-px bg-gradient-to-r from-emerald via-cyan to-amber" />
          </div>
          <div className="text-xs text-muted-foreground">دنیای ما</div>
          <ChevronRight className="w-4 h-4 text-amber" />
          <div className="text-xs text-amber font-medium">بدون دروغ</div>
          <div className="w-3 h-3 rounded-full bg-amber" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '۶ بعد', sublabel: 'تحلیل شده', value: '۶', color: 'text-amber' },
          { label: '۵۰۰ سال', sublabel: 'زودتر به عصر روشن', value: '۵۰۰', color: 'text-cyan' },
          { label: '۸ حوزه', sublabel: 'مقایسه شده', value: '۸', color: 'text-emerald' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-3 rounded-xl border border-border/30 bg-card/30"
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-medium mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground">{stat.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* 6 Dimensions Grid */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground px-1 flex items-center gap-1.5">
          <ArrowDown className="w-3 h-3" />
          برای جزئیات بیشتر روی هر بعد کلیک کنید
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIMENSIONS.map((dim, i) => (
            <DimensionCard
              key={dim.id}
              dimension={dim}
              index={i}
              isActive={activeDimension === dim.id}
              onClick={() =>
                setActiveDimension(activeDimension === dim.id ? null : dim.id)
              }
            />
          ))}
        </div>
        <AnimatePresence>
          {activeDimension && (
            <ExpandedDimension
              dimension={DIMENSIONS.find((d) => d.id === activeDimension)!}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Toggle */}
      <div className="space-y-3">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border/50 bg-card/30 hover:border-amber/30 transition-all"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Scale className="w-4 h-4 text-amber" />
            جدول مقایسه: دنیای ما vs. دنیای بدون دروغ
          </span>
          <motion.div
            animate={{ rotate: showComparison ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ComparisonTable />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plot Twist */}
      <PlotTwistSection />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="gap-2 w-full sm:w-auto border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          بازگشت
        </Button>
        <Button
          onClick={onSimulate}
          className="bg-amber hover:bg-amber-dark text-black font-bold px-6 py-5 gap-2 shadow-lg shadow-amber/20 w-full sm:w-auto"
        >
          <Rocket className="w-4 h-4" />
          شبیه‌سازی با هوش مصنوعی
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Hero Section ──────────────────────────────────────
function HeroSection({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  const featured = SCENARIOS.find(s => 'featured' in s && s.featured);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-3xl mx-auto text-center space-y-8 py-8 md:py-16"
    >
      <motion.div
        className="relative w-28 h-28 md:w-36 md:h-36 mx-auto text-amber"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ButterflyIcon className="w-full h-full" />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(245, 158, 11, 0.1)',
              '0 0 60px rgba(245, 158, 11, 0.2)',
              '0 0 20px rgba(245, 158, 11, 0.1)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          <span className="text-amber">The Butterfly</span>{' '}
          <span className="text-foreground">Effect</span>
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          A butterfly flaps its wings in ancient Egypt, and a thousand years later, the Roman Empire reaches the moon with starships.
        </p>
        <p className="text-sm text-muted-foreground/60">
          Interactive Thought Lab &mdash; Chaos Theory &times; Alternate History &times; AI
        </p>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="bg-amber hover:bg-amber-dark text-black font-bold px-8 py-6 text-base gap-2 shadow-lg shadow-amber/20 hover:shadow-amber/40 transition-shadow"
        >
          <Play className="w-5 h-5" />
          Start Simulation
        </Button>
      </motion.div>

      {/* Featured Scenario Card */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={onExplore}
          className="cursor-pointer group"
        >
          <div className="relative mx-auto max-w-lg rounded-xl border-2 border-amber/20 bg-gradient-to-br from-amber/5 via-card/50 to-cyan/5 p-5 hover:border-amber/40 transition-all hover:shadow-lg hover:shadow-amber/10">
            <div className="absolute -top-2.5 left-4">
              <Badge className="bg-amber text-black font-bold px-3 py-0.5 text-[10px]">
                Featured Scenario
              </Badge>
            </div>
            <div className="flex items-start gap-4 mt-2">
              <div className="shrink-0 p-3 rounded-xl bg-amber/10 text-amber">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-base mb-1 group-hover:text-amber transition-colors">
                  {featured.tag}: حذف کامل مفهوم دروغ
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  اگر در سال ۱۰۲۶ میلادی، انسان‌ها قصد فریب نداشتند — ۶ بعد تحلیلی + جدول مقایسه + شبیه‌سازی AI
                </p>
                <div className="flex items-center gap-2 mt-3 text-amber/70 group-hover:text-amber transition-colors">
                  <span className="text-xs font-medium">کاوش کنید</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Zap className="w-3 h-3 text-amber" /> 3 Simple Steps
        </Badge>
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Sparkles className="w-3 h-3 text-cyan" /> Advanced AI
        </Badge>
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Globe className="w-3 h-3 text-emerald" /> Dynamic Timeline
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        {[
          {
            step: '01',
            title: 'The Ripple',
            desc: 'Choose a time, place, and change',
            icon: <Zap className="w-5 h-5" />,
            iconClass: 'bg-amber/10 text-amber',
          },
          {
            step: '02',
            title: 'Magnitude',
            desc: 'Set how secret or public the change was',
            icon: <Globe className="w-5 h-5" />,
            iconClass: 'bg-cyan/10 text-cyan',
          },
          {
            step: '03',
            title: 'Simulate',
            desc: 'Hit the button and watch history unfold',
            icon: <Play className="w-5 h-5" />,
            iconClass: 'bg-emerald/10 text-emerald',
          },
        ].map((item) => (
          <motion.div
            key={item.step}
            className="p-4 rounded-xl border border-border/30 bg-card/30 text-center space-y-2"
            whileHover={{ y: -4, borderColor: 'oklch(0.78 0.15 80 / 30%)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-xs text-muted-foreground/50 font-mono">{item.step}</span>
            <div className={`inline-flex p-2.5 rounded-lg ${item.iconClass}`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-sm">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<Step>('idle');
  const [era, setEra] = useState('');
  const [location, setLocation] = useState('');
  const [change, setChange] = useState('');
  const [magnitude, setMagnitude] = useState<Magnitude>('public');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleFieldChange = useCallback((field: string, value: string) => {
    if (field === 'era') setEra(value);
    else if (field === 'location') setLocation(value);
    else if (field === 'change') setChange(value);
  }, []);

  const handleReset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setStep('idle');
    setEra('');
    setLocation('');
    setChange('');
    setMagnitude('public');
    setCheckpoints([]);
    setFeaturedImage(null);
    setError(null);
  }, []);

  const handleExplore = useCallback(() => {
    const featured = SCENARIOS.find(s => 'featured' in s && s.featured);
    if (featured) {
      setEra(featured.era);
      setLocation(featured.location);
      setChange(featured.change);
      setMagnitude(featured.magnitude);
    }
    setStep('explore');
  }, []);

  const handleExploreSimulate = useCallback(() => {
    setStep('magnitude');
  }, [era, location, change, magnitude]);

  const handleSimulate = useCallback(async () => {
    setStep('simulate');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ era, location, change, magnitude }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Server error (${res.status}): ${errData.error || 'Unknown'}`);
      }

      const data = await res.json();
      if (data.success) {
        setCheckpoints(data.checkpoints || []);
        setFeaturedImage(data.featured_image || null);
        setStep('results');
      } else {
        throw new Error(data.error || 'Invalid server response');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Simulation error:', err);
        setError(err.message || 'Network error — check your connection');
        setStep('ripple');
      }
    }
  }, [era, location, change, magnitude]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleField />

      <header className="relative z-10 border-b border-border/30 bg-background/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ButterflyIcon className="w-7 h-7 text-amber" />
            <span className="font-bold text-sm md:text-base tracking-tight">
              The Butterfly Effect
            </span>
          </div>
          {step !== 'idle' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-6 md:py-10">
        {step !== 'idle' && step !== 'simulate' && step !== 'results' && (
          <StepIndicator currentStep={step} />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-rose/30 bg-rose/10 text-rose text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'idle' && <HeroSection onStart={() => setStep('ripple')} onExplore={handleExplore} />}

          {step === 'explore' && (
            <DeepDiveView
              onBack={handleReset}
              onSimulate={handleExploreSimulate}
            />
          )}

          {step === 'ripple' && (
            <RippleStep
              data={{ era, location, change }}
              onChange={handleFieldChange}
              onNext={() => setStep('magnitude')}
            />
          )}

          {step === 'magnitude' && (
            <MagnitudeStep
              value={magnitude}
              onChange={setMagnitude}
              onNext={handleSimulate}
              onBack={() => setStep('ripple')}
            />
          )}

          {step === 'simulate' && <SimulationLoading />}

          {step === 'results' && (
            <ResultsView
              checkpoints={checkpoints}
              featuredImage={featuredImage}
              onReset={handleReset}
              inputData={{ era, location, change }}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-border/20 bg-background/50 backdrop-blur-md mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground/50">
            The Butterfly Effect &mdash; Interactive Thought Lab &mdash; Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}
