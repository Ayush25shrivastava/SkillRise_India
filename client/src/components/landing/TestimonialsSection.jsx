/**
 * TestimonialsSection — Social proof with user testimonials
 * Card-based layout with quotes, ratings, and avatars
 */
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    content:
      "The mock interview feature is incredible. It felt like a real interview with adaptive follow-up questions. My confidence grew 10x before my actual interview.",
    rating: 5,
    avatar: 'PS',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst at Flipkart',
    content:
      "Resume Analyzer caught issues I never noticed. It suggested ATS-friendly keywords and restructured my bullet points. Got 3x more callbacks after the changes.",
    rating: 5,
    avatar: 'RV',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Ananya Gupta',
    role: 'Final Year CS Student',
    content:
      "The career chatbot is like having a personal mentor available 24/7. It helped me choose between data science and full-stack development with an actionable roadmap.",
    rating: 5,
    avatar: 'AG',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-36 sm:py-44 px-6 sm:px-10 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

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
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Loved by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Professionals
            </span>
          </h2>
          <p className="text-lg text-white/30 font-medium max-w-2xl mx-auto leading-relaxed">
            Hear from people who transformed their careers with SkillRise.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-10 sm:p-12 transition-all duration-500 hover:-translate-y-1 hover:border-white/10"
            >
              {/* Quote icon */}
              <Quote size={36} className="text-white/[0.06] mb-8" />

              {/* Rating */}
              <div className="flex gap-1.5 mb-8">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/50 font-medium leading-relaxed mb-10 text-lg italic">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-base">{t.name}</p>
                  <p className="text-white/30 text-sm font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
