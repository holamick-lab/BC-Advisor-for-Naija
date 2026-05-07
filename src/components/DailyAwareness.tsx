import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { getDailyAwareness } from '../services/geminiService';
import Markdown from 'react-markdown';

export default function DailyAwareness() {
  const [news, setNews] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAwareness = async () => {
    setLoading(true);
    try {
      const result = await getDailyAwareness();
      setNews(result || "No recent updates found.");
    } catch (error) {
      setNews("Failed to fetch fresh awareness data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwareness();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-medical-accent/10 text-medical-accent rounded-lg">
            <Newspaper size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Daily Awareness Highlights</h2>
        </div>
        <button 
          onClick={fetchAwareness}
          disabled={loading}
          className="text-xs flex items-center gap-2 text-slate-500 hover:text-medical-accent transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Latest
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-medical-accent/10 border-t-medical-accent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">Crawling medical databases...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-li:marker:text-medical-accent"
          >
             <div className="markdown-body">
              <Markdown>{news || ""}</Markdown>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>Updated on {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><ExternalLink size={12} /> PubMed</span>
                <span className="flex items-center gap-1"><ExternalLink size={12} /> Cochrane</span>
                <span className="flex items-center gap-1"><ExternalLink size={12} /> EMBASE</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl text-white">
          <h4 className="font-bold text-sm mb-2 opacity-60 uppercase tracking-widest">Global Status</h4>
          <p className="text-2xl font-serif">1 in 8 women</p>
          <p className="text-xs opacity-50 mt-1">Develops invasive breast cancer over their lifetime.</p>
        </div>
        <div className="bg-medical-accent p-6 rounded-2xl text-white">
          <h4 className="font-bold text-sm mb-2 opacity-60 uppercase tracking-widest">Early Detection</h4>
          <p className="text-2xl font-serif">99% Survival Rate</p>
          <p className="text-xs opacity-50 mt-1">When detected early in the localized stage.</p>
        </div>
      </div>
    </div>
  );
}
