import React from 'react';
import { Info, Shield, Users, Heart } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">About BC Advisor 4 Naija</h2>
        <p className="text-xl text-slate-500 leading-relaxed">
          BC Advisor 4 Naija is a multilingual platform dedicated to providing accessible, 
          accurate breast cancer education for Nigerian indigenous language speakers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-medical-accent/10 text-medical-accent rounded-xl flex items-center justify-center mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-lg font-bold mb-3">Our Mission</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            To bridge the language gap in healthcare by providing medical resources in Yoruba, Hausa, and Igbo, 
            ensuring no mother, sister, or daughter is left behind due to language barriers.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-medical-accent/10 text-medical-accent rounded-xl flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-lg font-bold mb-3">Privacy & Security</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your health questions are private. We use advanced encryption to protect your data, and we do not store 
            personally identifiable information without your consent.
          </p>
        </div>
      </div>

      <section className="bg-slate-900 text-white p-10 rounded-3xl">
        <h3 className="text-2xl font-serif font-bold mb-6">Powered by Advanced AI</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
             <div className="shrink-0 w-6 h-6 rounded-full bg-medical-accent flex items-center justify-center text-[10px] font-bold">01</div>
             <div>
               <h4 className="font-bold text-sm">Gemini AI Engine</h4>
               <p className="text-xs text-slate-400 mt-1">High-performance reasoning and medical summarization.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="shrink-0 w-6 h-6 rounded-full bg-medical-accent flex items-center justify-center text-[10px] font-bold">02</div>
             <div>
               <h4 className="font-bold text-sm">RAG (Retrieval-Augmented Generation)</h4>
               <p className="text-xs text-slate-400 mt-1">Grounded in real-time medical facts from PubMed, CDC, and WHO.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="shrink-0 w-6 h-6 rounded-full bg-medical-accent flex items-center justify-center text-[10px] font-bold">03</div>
             <div>
               <h4 className="font-bold text-sm">Multilingual Bridge</h4>
               <p className="text-xs text-slate-400 mt-1">Sophisticated translation layers for Yoruba, Hausa, and Igbo.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
