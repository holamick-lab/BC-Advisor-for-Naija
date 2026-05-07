import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageSquare, BookOpen, Info, HelpCircle, User, Globe } from 'lucide-react';
import { Language } from '../types';

interface LayoutProps {
  children: ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Layout({ children, activePage, setActivePage, language, setLanguage }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'chat', label: 'Consult', icon: MessageSquare },
    { id: 'awareness', label: 'Daily Awareness', icon: Globe },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
    { id: 'feedback', label: 'Feedback', icon: User },
  ];

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'yoruba', label: 'Yoruba' },
    { id: 'hausa', label: 'Hausa' },
    { id: 'igbo', label: 'Igbo' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 medical-gradient text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-medical-accent rounded-xl flex items-center justify-center font-serif text-2xl font-bold">B</div>
          <h1 className="text-xl font-bold tracking-tight leading-tight">BC Advisor 4 Naija</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id 
                  ? 'bg-white/10 text-white shadow-xl' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <Globe size={14} />
            <span>Select Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-medical-accent"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id} className="bg-slate-900">{l.label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden medical-gradient text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-medical-accent rounded-lg flex items-center justify-center font-serif text-lg font-bold">B</div>
          <span className="font-bold">BC Advisor 4 Naija</span>
        </div>
        <div className="flex items-center gap-4">
           <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id} className="bg-slate-900">{l.label}</option>
            ))}
          </select>
          <button onClick={() => setIsOpen(!isOpen)} className="p-1">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
