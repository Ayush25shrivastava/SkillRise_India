/**
 * CTASection — Final call-to-action before the footer
 * Bold headline with gradient text, large CTA button
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-36 sm:py-44 px-6 sm:px-10 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-violet-950/40 via-[#0c0c18] to-indigo-950/40 border border-violet-500/10 rounded-[3rem] p-16 sm:p-20 md:p-28 text-center overflow-hidden"
        >
          {/* Background glow effects */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

          <div className="relative z-10 space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
              <Zap size={14} className="fill-violet-400" />
              Start Your Journey Today
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to Transform
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
                Your Career?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-lg text-white/30 font-medium max-w-xl mx-auto leading-relaxed">
              Join thousands of professionals using AI to practice smarter, optimize better, and grow faster. It's free to start.
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => navigate('/register')}
                className="group inline-flex items-center gap-3 px-14 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.03] active:scale-95"
              >
                Get Started — It's Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
