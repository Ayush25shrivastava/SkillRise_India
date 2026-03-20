/**
 * LandingFooter — Premium dark footer
 * Branding, navigation links, social icons, and copyright
 */
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Mock Interview', href: '#features' },
    { label: 'Resume Analyzer', href: '#features' },
    { label: 'AI Chatbot', href: '#features' },
    { label: 'Pricing', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Career Guide', href: '#' },
    { label: 'API', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-[#06060a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 py-24 sm:py-28">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-16 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Rise</span>
              </span>
            </div>
            <p className="text-white/25 font-medium text-sm leading-relaxed max-w-xs">
              AI-powered career acceleration platform. Practice interviews, analyze resumes, and get personalized career guidance.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] hover:border-white/10 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h4 className="text-xs font-bold text-white/20 uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/30 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/15 font-medium">
            © {new Date().getFullYear()} SkillRise India. All rights reserved.
          </p>
          <p className="text-sm text-white/15 font-medium">
            Built with <span className="text-violet-400/40">♥</span> and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
