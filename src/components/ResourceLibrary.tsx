import React, { useState } from 'react';
import { Search, Book, Bookmark } from 'lucide-react';
import { GlossaryEntry } from '../types';

const GLOSSARY_DATA: GlossaryEntry[] = [
  {
    term: "Mastectomy",
    definition: "Surgical removal of one or both breasts.",
    yoruba: "Iṣẹ́-abẹ láti yọ ọmú kúrò",
    hausa: "Aikin da ake yi na cire nono",
    igbo: "Ịwa ahụ iwepụ ara"
  },
  {
    term: "Chemotherapy",
    definition: "Use of drugs to destroy cancer cells.",
    yoruba: "Ìtọ́jú kími-tẹ́ràpì",
    hausa: "Amfani da magunguna don kashe kwayoyin cutar kansa",
    igbo: "Ọgwụgwọ kemoterapi"
  },
  {
    term: "Biopsy",
    definition: "Taking a small sample of tissue for examination.",
    yoruba: "Ṣíṣàyẹ̀wò apá kan ara",
    hausa: "Daukar dan karamin nama don gwaji",
    igbo: "Ịwepụ obere anụ ahụ maka nyocha"
  },
  {
    term: "Benign",
    definition: "Not cancerous; does not spread to other parts of the body.",
    yoruba: "Kì í ṣe jẹjẹrẹ",
    hausa: "Cuta marar hadari (ba kansa ba)",
    igbo: "Ọ bụghị kansa"
  },
  {
    term: "Malignant",
    definition: "Cancerous; can invade and destroy nearby tissue and spread.",
    yoruba: "Jẹjẹrẹ tí ó léwu",
    hausa: "Cutar daji mai natsuwa (kansa)",
    igbo: "Kansa dị ize ndụ"
  }
];

export default function ResourceLibrary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = GLOSSARY_DATA.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-medical-primary medical-gradient p-8 rounded-3xl text-white">
        <h2 className="text-3xl font-serif font-bold mb-2">Language Resources</h2>
        <p className="text-slate-400">Glossary and dictionaries for common clinical breast cancer terms in Yoruba, Hausa, and Igbo.</p>
        
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-medical-accent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-medical-accent/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{item.term}</h3>
                <p className="text-slate-500 mt-1">{item.definition}</p>
              </div>
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-medical-accent transition-colors">
                <Bookmark size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-slate-50 pt-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Yoruba</span>
                <p className="text-sm font-medium text-slate-700">{item.yoruba}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hausa</span>
                <p className="text-sm font-medium text-slate-700">{item.hausa}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Igbo</span>
                <p className="text-sm font-medium text-slate-700">{item.igbo}</p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No terms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
