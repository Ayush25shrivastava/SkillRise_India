/**
 * FeaturesSection — Three product feature cards
 * Mock Interview, Resume Analyzer, Agentic Chatbot
 * Each card has an icon, glow border, hover animation
 */
import { motion } from 'framer-motion';
import { Mic, FileSearch, Bot, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Mock Interview',
    description:
      'Practice with an AI interviewer that adapts to your level, evaluates your answers in real-time, and provides actionable feedback to help you ace any interview.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'violet',
    delay: 0,
  },
  {
    icon: FileSearch,
    title: 'Resume Analyzer',
    description:
      'Get instant AI-powered feedback on your resume. Identify gaps, optimize keywords, and receive a detailed score with personalized improvement suggestions.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'cyan',
    delay: 0.15,
  },
  {
    icon: Bot,
    title: 'Agentic Chatbot',
    description:
      'Your personal career co-pilot. Ask questions about career paths, skill development, job markets, and get intelligent, context-aware guidance 24/7.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'emerald',
    delay: 0.3,
  },
];

const glowColors = {
  violet: 'hover:border-violet-500/30 hover:shadow-violet-500/10',
  cyan: 'hover:border-cyan-500/30 hover:shadow-cyan-500/10',
  emerald: 'hover:border-emerald-500/30 hover:shadow-emerald-500/10',
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-36 sm:py-44 px-6 sm:px-10 lg:px-8">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

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
            Core Features
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Level Up
            </span>
          </h2>
          <p className="text-lg text-white/30 font-medium max-w-2xl mx-auto leading-relaxed">
            Three powerful AI tools designed to accelerate your career growth from every angle.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: feature.delay }}
              className={`group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-10 sm:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${glowColors[feature.glow]}`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}
              >
                <feature.icon size={28} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-5 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/35 font-medium leading-relaxed mb-10 text-base">
                {feature.description}
              </p>

              {/* Learn more link */}
              <div className="flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white/70 transition-colors">
                <span>Explore</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>

              {/* Subtle gradient border glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
