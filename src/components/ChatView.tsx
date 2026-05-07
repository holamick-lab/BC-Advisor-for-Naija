import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, AlertCircle, Loader2, MessageSquare, Volume2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { askMedicalQuestion, translateText } from '../services/geminiService';

interface ChatViewProps {
  language: Language;
}

export default function ChatView({ language }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  const speak = (text: string, lang: Language) => {
    if (!synthRef.current) return;

    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map languages to BCP 47 tags
    const langCodes: Record<Language, string> = {
      english: 'en-NG', // Preferred Nigerian English
      yoruba: 'yo-NG',
      hausa: 'ha-NG',
      igbo: 'ig-NG'
    };
    
    utterance.lang = langCodes[lang];

    // Attempt to find a more relatable regional voice (Nigerian or African)
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('NG') || 
      v.lang.includes('ZA') || 
      v.lang.includes('KE') ||
      v.name.toLowerCase().includes('nigeria') ||
      v.name.toLowerCase().includes('africa')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.85; // Slightly slower for empathy and clarity
    utterance.pitch = 1.0;

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Set lang based on selection
      const langCodes: Record<Language, string> = {
        english: 'en-US',
        yoruba: 'yo-NG',
        hausa: 'ha-NG',
        igbo: 'ig-NG'
      };
      recognition.lang = langCodes[language];

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      language: language,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // 1. Translate to English (NLLB simulation via Gemini)
      const englishQuery = await translateText(userText, language, 'english');
      
      // 2. Ask Gemini with RAG
      const englishResponse = await askMedicalQuestion(englishQuery);
      
      // 3. Translate response back to indigenous language
      const translatedResponse = await translateText(englishResponse, 'english', language);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: translatedResponse,
        originalContent: englishResponse,
        language: language,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Log interaction for continuous improvement
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userText,
          englishQuery,
          botResponse: translatedResponse,
          englishResponse,
          language
        })
      }).catch(err => console.error("Logging failed:", err));
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, there was an error processing your request. Please try again.",
        language: language,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-200px)]">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Breast Cancer Consultation</h2>
        <p className="text-slate-500 text-sm">Ask anything in {language}. Powered by Gemini & Multilingual RAG.</p>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4"
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-medical-accent/10 text-medical-accent rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">Peace be upon you</h3>
              <p className="text-slate-500 max-w-sm mt-2">
                Select your language and ask any question about breast cancer. You can type or click the microphone to speak.
              </p>
            </motion.div>
          )}

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm relative group ${
                m.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-[15px] leading-relaxed">{m.content}</p>
                <div className="flex items-center justify-between mt-1.5 border-t border-slate-500/10 pt-1.5">
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => speak(m.content, language)}
                      className="text-medical-accent flex items-center gap-1 hover:opacity-80 transition-all"
                    >
                      <Volume2 size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Listen</span>
                    </button>
                  )}
                  <div className={`text-[10px] opacity-40 uppercase tracking-wider font-bold ${m.role === 'assistant' ? '' : 'w-full text-right'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-medical-accent rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-medical-accent rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-medical-accent rounded-full" />
                </div>
                <span className="text-xs font-medium text-slate-400">Advisor is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning */}
      <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs">
        <AlertCircle size={14} className="mt-0.5" />
        <p>This is an educational tool. Always consult a qualified medical doctor (Oncologist) for diagnosis and treatment.</p>
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
        <button 
          onClick={toggleRecording}
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isRecording ? 'bg-medical-accent text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
        >
          {isRecording ? <Mic size={22} /> : <Mic size={22} />}
        </button>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about breast cancer in ${language}...`}
          className="flex-1 bg-transparent px-2 text-slate-700 focus:outline-none font-medium"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="shrink-0 w-12 h-12 bg-medical-accent text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
