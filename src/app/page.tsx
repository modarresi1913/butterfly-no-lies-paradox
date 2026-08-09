'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Globe,
  Clock,
  ChevronLeft,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Types ─────────────────────────────────────────────
type Magnitude = 'secret' | 'limited' | 'public';
type Step = 'idle' | 'ripple' | 'magnitude' | 'simulate' | 'results';

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
    era: '۵۰۰ پیش از میلاد',
    location: 'ایران باستان - تخت جمشید',
    change: 'اختراع ماشین چاپ توسط کوروش کبیر',
    magnitude: 'public' as Magnitude,
  },
  {
    era: '۱۲۰۰ پیش از میلاد',
    location: 'مصر باستان - قاهره',
    change: 'اختراع باتری و لامپ‌های ابتدایی',
    magnitude: 'limited' as Magnitude,
  },
  {
    era: '۳۳۰ پیش از میلاد',
    location: 'یونان باستان - آتن',
    change: 'اکتشاف اتم و انرژی هسته‌ای توسط ارسطو',
    magnitude: 'secret' as Magnitude,
  },
];

const ERA_SUGGESTIONS = [
  '۳۰۰۰ پیش از میلاد',
  '۲۵۰۰ پیش از میلاد',
  '۱۲۰۰ پیش از میلاد',
  '۸۰۰ پیش از میلاد',
  '۵۰۰ پیش از میلاد',
  '۳۳۰ پیش از میلاد',
  '۱۰۰ پیش از میلاد',
  '۱۰۰ میلادی',
  '۵۰۰ میلادی',
  '۸۰۰ میلادی',
  '۱۲۰۰ میلادی',
  '۱۵۰۰ میلادی',
];

const LOCATION_SUGGESTIONS = [
  'ایران باستان - تخت جمشید',
  'مصر باستان - قاهره',
  'یونان باستان - آتن',
  'روم باستان',
  'چین باستان - پکن',
  'هند باستان',
  'بین‌النهرین - بابل',
  'امپراتوری عثمانی - استانبول',
  'اروپای قرون وسطی',
  'ژاپن باستان - کیوتو',
];

const MAGNITUDE_OPTIONS: {
  value: Magnitude;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'secret',
    label: 'مخفیانه',
    description: 'فقط یک گروه کوچک از تغییر آگاه است',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    value: 'limited',
    label: 'محدود',
    description: 'در اختیار الیت و حاکمان',
    icon: <Eye className="w-5 h-5" />,
  },
  {
    value: 'public',
    label: 'عمومی',
    description: 'تمام مردم به آن دسترسی دارند',
    icon: <Users className="w-5 h-5" />,
  },
];

// ─── Butterfly SVG Component ───────────────────────────
function ButterflyIcon({ className = '' }: { className?: string }) {
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
      />\n      <line
        x1="50" y1="15"
        x2="50" y2="90"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Background Particles ──────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
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
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}

// ─── Step Indicator ────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: 'ripple' as Step, label: 'نقطه عطف', icon: <Zap className="w-4 h-4" /> },
    { key: 'magnitude' as Step, label: 'شدت', icon: <Globe className="w-4 h-4" /> },
    { key: 'simulate' as Step, label: 'شبیه‌سازی', icon: <Play className="w-4 h-4" /> },
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
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full border transition-colors ${
                isActive
                  ? 'border-amber/50 bg-amber/10 text-amber'
                  : isDone
                  ? 'border-emerald/50 bg-emerald/10 text-emerald'
                  : 'border-border/50 bg-card/50 text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDone ? (
                <Trophy className="w-4 h-4" />
              ) : (
                step.icon
              )}
              <span className="text-xs md:text-sm font-medium">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-px transition-colors ${
                  isDone ? 'bg-emerald/50' : 'bg-border/50'
                }`}
              />
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
          مرحله اول
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          نقطه عطف تاریخ را انتخاب کن
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          یک زمان، مکان و تغییر کوچک انتخاب کن تا موج آشوب شروع شود
        </p>
      </div>

      {/* Quick Scenarios */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground px-1">سناریوهای پیشنهادی:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={i}
              className="text-right p-3 rounded-lg border border-border/50 bg-card/50 hover:border-amber/40 hover:bg-amber/5 transition-all group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onChange('era', s.era);
                onChange('location', s.location);
                onChange('change', s.change);
              }}
            >
              <p className="text-sm font-medium text-amber/80 group-hover:text-amber transition-colors">
                {s.change}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {s.era} &bull; {s.location}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <Card className="glass-card">
        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Era */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber" />
              زمان (دوره تاریخی)
            </label>
            <Input
              value={data.era}
              onChange={(e) => onChange('era', e.target.value)}
              onFocus={() => setShowSuggestions('era')}
              onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
              placeholder="مثلاً: ۵۰۰ پیش از میلاد"
              className="text-right"
            />
            <AnimatePresence>
              {showSuggestions === 'era' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-border/50 bg-card backdrop-blur-md shadow-xl overflow-hidden"
                >
                  {ERA_SUGGESTIONS.filter((s) =>
                    s.includes(data.era) && data.era.length > 0
                  ).map((s) => (
                    <button
                      key={s}
                      className="w-full text-right px-3 py-2 text-sm hover:bg-amber/10 hover:text-amber transition-colors"
                      onMouseDown={() => onChange('era', s)}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan" />
              مکان
            </label>
            <Input
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              onFocus={() => setShowSuggestions('location')}
              onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
              placeholder="مثلاً: ایران باستان - تخت جمشید"
              className="text-right"
            />\n            <AnimatePresence>
              {showSuggestions === 'location' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-border/50 bg-card backdrop-blur-md shadow-xl overflow-hidden"
                >
                  {LOCATION_SUGGESTIONS.filter((s) =>
                    s.includes(data.location) && data.location.length > 0
                  ).map((s) => (
                    <button
                      key={s}
                      className="w-full text-right px-3 py-2 text-sm hover:bg-cyan/10 hover:text-cyan transition-colors"
                      onMouseDown={() => onChange('location', s)}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Change */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald" />
              تغییر (تغییر کوچکی که تاریخ را متحول می‌کند)
            </label>
            <Textarea
              value={data.change}
              onChange={(e) => onChange('change', e.target.value)}
              placeholder="مثلاً: اختراع ماشین چاپ توسط کوروش کبیر"
              className="text-right min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-amber hover:bg-amber-dark text-black font-medium px-6 gap-2"
        >
          مرحله بعد
          <ChevronLeft className="w-4 h-4" />
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
          مرحله دوم
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          شدت تغییر چقدر است؟
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          تعیین کن این تغییر چقدر مخفیانه یا عمومی بوده
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
          مرحله قبل
        </Button>
        <Button
          onClick={onNext}
          className="bg-amber hover:bg-amber-dark text-black font-medium px-6 gap-2"
        >
          شبیه‌سازی کن!
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Simulation Loading ────────────────────────────────
function SimulationLoading() {
  const messages = [
    'در حال تحلیل تاریخ...',
    'محاسبه زنجیره علت‌ومعلول...',
    'ساخت خط زمانی جایگزین...',
    'رندر تصاویر...',
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto text-center space-y-6 py-20"
    >
      <div className="relative w-32 h-32 mx-auto">
        {/* Ripple rings */}
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
        {/* Butterfly */}
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
                نقطه انشعاب
              </Badge>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* World State */}
          <div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {checkpoint.world_state}
            </p>
          </div>

          {/* Achievements & Crises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Achievements */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald text-xs font-medium">
                <Trophy className="w-3.5 h-3.5" />
                دستاوردها
              </div>
              {checkpoint.achievements.slice(0, expanded ? undefined : 2).map((a, i) => (
                <p key={i} className="text-xs text-muted-foreground pr-4">
                  &bull; {a}
                </p>
              ))}
              {checkpoint.achievements.length > 2 && !expanded && (
                <button
                  className="text-xs text-amber/70 hover:text-amber pr-4"
                  onClick={() => setExpanded(true)}
                >
                  +{checkpoint.achievements.length - 2} مورد دیگر
                </button>
              )}
            </div>

            {/* Crises */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                بحران‌ها
              </div>
              {checkpoint.crises.slice(0, expanded ? undefined : 2).map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground pr-4">
                  &bull; {c}
                </p>
              ))}
              {checkpoint.crises.length > 2 && !expanded && (
                <button
                  className="text-xs text-amber/70 hover:text-amber pr-4"
                  onClick={() => setExpanded(true)}
                >
                  +{checkpoint.crises.length - 2} مورد دیگر
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
          شبیه‌سازی کامل شد
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          خط زمانی جدید
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
          <div className="text-xs text-muted-foreground">تاریخ اصلی</div>
          <ChevronLeft className="w-4 h-4 text-amber" />
          <div className="text-xs text-amber font-medium">تاریخ جایگزین</div>
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
              alt="تصویر رندر شده از جهان جایگزین"
              className="w-full h-auto"
            />
            <div className="p-3 bg-card/80 text-center">
              <p className="text-xs text-muted-foreground">
                تصویر رندر شده توسط هوش مصنوعی از مهم‌ترین شهر در خط زمانی جدید
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Checkpoints */}
      <div className="space-y-0 custom-scrollbar max-h-[70vh] overflow-y-auto pr-2 pl-2 pb-8">
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
          شبیه‌سازی جدید
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Hero Section ──────────────────────────────────────
function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-3xl mx-auto text-center space-y-8 py-8 md:py-16"
    >
      {/* Butterfly Animation */}
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

      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          <span className="text-amber">The Butterfly</span>{' '}
          <span className="text-foreground">Effect</span>
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          یک پروانه در مصر باستان بال می‌زند و هزار سال بعد، امپراتوری روم با سفینه‌های فضایی به کره ماه سفر می‌کند.
        </p>
        <p className="text-sm text-muted-foreground/60">
          آزمایشگاه فکری تعاملی &mdash; نظریه آشوب &times; تاریخ جایگزین &times; هوش مصنوعی
        </p>
      </div>

      {/* CTA */}
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
          شروع شبیه‌سازی
        </Button>
      </motion.div>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Zap className="w-3 h-3 text-amber" /> سه مرحله ساده
        </Badge>
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Sparkles className="w-3 h-3 text-cyan" /> هوش مصنوعی پیشرفته
        </Badge>
        <Badge variant="outline" className="border-border/50 text-muted-foreground gap-1.5 px-3 py-1">
          <Globe className="w-3 h-3 text-emerald" /> خط زمانی پویا
        </Badge>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-right">
        {[
          {
            step: '01',
            title: 'نقطه عطف',
            desc: 'زمان، مکان و تغییر را انتخاب کن',
            icon: <Zap className="w-5 h-5" />,
            color: 'amber',
          },
          {
            step: '02',
            title: 'شدت تغییر',
            desc: 'مخفیانه یا عمومی بودن تغییر را تعیین کن',
            icon: <Globe className="w-5 h-5" />,
            color: 'cyan',
          },
          {
            step: '03',
            title: 'شبیه‌سازی',
            desc: 'دکمه بزن و خط زمانی جدید را ببین',
            icon: <Play className="w-5 h-5" />,
            color: 'emerald',
          },
        ].map((item) => (
          <motion.div
            key={item.step}
            className="p-4 rounded-xl border border-border/30 bg-card/30 text-center space-y-2"
            whileHover={{ y: -4, borderColor: 'oklch(0.78 0.15 80 / 30%)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-xs text-muted-foreground/50 font-mono">{item.step}</span>
            <div className={`inline-flex p-2.5 rounded-lg bg-${item.color}/10 text-${item.color}`}>
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
        throw new Error(errData.error || 'خطایی در شبیه‌سازی رخ داد');
      }

      const data = await res.json();
      if (data.success) {
        setCheckpoints(data.checkpoints || []);
        setFeaturedImage(data.featured_image || null);
        setStep('results');
      } else {
        throw new Error(data.error || 'پاسخ نامعتبر از سرور');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'خطای ناشناخته');
        setStep('ripple');
      }
    }
  }, [era, location, change, magnitude]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleField />

      {/* Header */}
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
              شروع مجدد
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
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
          {step === 'idle' && <HeroSection onStart={() => setStep('ripple')} />}

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

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 bg-background/50 backdrop-blur-md mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground/50">
            The Butterfly Effect &mdash; آزمایشگاه فکری تعاملی &mdash; ساخته شده با هوش مصنوعی
          </p>
        </div>
      </footer>
    </div>
  );
}
