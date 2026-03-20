/**
 * HowItWorksSection — 3-step visual flow
 * Upload → AI Analysis → Get Insights
 */
import { motion } from 'framer-motion';
import { Upload, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload & Start',
    description: 'Upload your resume or start a mock interview session. Our platform instantly prepares your personalized AI experience.',
    gradient: 'from-violet-600 to-purple-600',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Deep Analysis',
    description: 'Gemini AI evaluates your inputs with multi-dimensional analysis — skills, structure, communication, and industry relevance.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Get Insights & Grow',
    description: 'Receive a detailed dossier with scores, strengths, improvement areas, and personalized recommendations to accelerate your career.',
    gradient: 'from-emerald-600 to-teal-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-36 sm:py-44 px-6 sm:px-10 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 space-y-7"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Three Steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Career Growth
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="text-center space-y-8 relative"
            >
              {/* Step number circle */}
              <div className="flex justify-center">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl relative z-10`}>
                  <step.icon size={36} className="text-white" />
                </div>
              </div>

              {/* Step number label */}
              <div className="text-8xl font-black text-white/[0.03] absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none select-none">
                {step.number}
              </div>

              {/* Content */}
              <div className="space-y-4 px-4">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-white/30 font-medium leading-relaxed max-w-xs mx-auto text-base">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
