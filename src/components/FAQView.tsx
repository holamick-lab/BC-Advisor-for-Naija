import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { translateText } from '../services/geminiService';

interface FAQViewProps {
  language: Language;
}

const BASE_FAQS = [
  {
    q: "What is breast cancer?",
    a: "Breast cancer is a disease in which cells in the breast grow out of control. It is the most common cancer among women globally."
  },
  {
    q: "How can I check myself?",
    a: "You should perform a Breast Self-Examination (BSE) monthly, checking for lumps, changes in size, or skin abnormalities. Consult a doctor immediately if you notice anything unusual."
  },
  {
    q: "Is breast cancer curable?",
    a: "Yes, especially when detected early. Survival rates are significantly higher when it is localized to the breast."
  },
  {
    q: "Does breastfeeding reduce risk?",
    a: "Several studies suggest that breastfeeding can lower the risk of developing breast cancer, particularly if done for a year or more."
  },
  {
    q: "Who is at risk?",
    a: "Risk factors include age, genetics (BRCA1/2 genes), family history, and lifestyle factors. However, early detection is key for everyone."
  }
];

export default function FAQView({ language }: FAQViewProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [faqs, setFaqs] = useState(BASE_FAQS);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateFaqs = async () => {
      if (language === 'english') {
        setFaqs(BASE_FAQS);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await Promise.all(
          BASE_FAQS.map(async (faq) => ({
            q: await translateText(faq.q, 'english', language),
            a: await translateText(faq.a, 'english', language)
          }))
        );
        setFaqs(translated);
      } catch (error) {
        console.error("FAQ Translation failed:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateFaqs();
  }, [language]);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-500">Quick answers to common concerns about breast cancer.</p>
        </div>
        {isTranslating && (
          <div className="flex items-center gap-2 text-medical-accent animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Translating to {language}...</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold text-slate-700">{faq.q}</span>
              {openIdx === idx ? <ChevronUp size={20} className="text-medical-accent" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
