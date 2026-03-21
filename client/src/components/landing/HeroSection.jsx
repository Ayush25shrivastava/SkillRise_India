/**
 * HeroSection — The main above-the-fold section
 * Left: Heading, subheading, CTA buttons
 * Right: Animated glowing neural-network sphere
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, FileText, Sparkles } from 'lucide-react';
import GlowingSphere from './GlowingSphere';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 w-full pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-10 relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={14} className="fill-violet-400" />
              Powered by Gemini AI
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Your AI Career{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
                Launchpad.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/40 font-medium leading-relaxed max-w-xl">
              Practice mock interviews, analyze your resume, and get personalized 
              career guidance — all powered by cutting-edge AI intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="group flex items-center gap-3 px-8 py-4.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 px-7 py-4.5 bg-white/5 border border-white/10 text-white/80 font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Mic size={18} className="text-violet-400" />
                Try Mock Interview
              </button>

              <button
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 px-7 py-4.5 bg-white/5 border border-white/10 text-white/80 font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <FileText size={18} className="text-cyan-400" />
                Analyze Resume
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                {[
                  'from-violet-500 to-purple-600',
                  'from-blue-500 to-cyan-500',
                  'from-emerald-500 to-teal-500',
                  'from-orange-500 to-rose-500',
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-[#06060a] flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {['A', 'S', 'R', 'P'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium">
                  <span className="text-white font-bold">2,000+</span> professionals leveling up
                </p>
                <div className="flex gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Sphere Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-[360px] sm:h-[440px] lg:h-[520px] relative"
          >
            <GlowingSphere />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
