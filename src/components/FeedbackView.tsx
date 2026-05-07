import React, { useState } from 'react';
import { Send, Star } from 'lucide-react';

const SUS_QUESTIONS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system"
];

export default function FeedbackView() {
  const [rating, setRating] = useState(0);
  const [susResponses, setSusResponses] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSusChange = (questionIndex: number, value: number) => {
    setSusResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const isFormValid = rating > 0 && Object.keys(susResponses).length === SUS_QUESTIONS.length;

  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdeRhQomBQSeUut3alLeQFl67jSz9o66D7EtExa2uC5JOnH6g/viewform";

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    try {
      // 1. Log to our backend first
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rating, 
          susResponses,
          comment, 
          page: 'feedback_form_with_sus' 
        })
      });

      // 2. Open Google Form in a new tab for final submission as requested
      // Note: Full programmatic cross-origin POST to Google Forms is restricted by CORS.
      // Opening the form in a new tab ensures the user sees their response is recorded on Google's platform.
      window.open(GOOGLE_FORM_URL, '_blank');
      
      setSubmitted(true);
    } catch (error) {
      console.error("Feedback submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Thank you for your feedback!</h2>
        <p className="text-slate-500 mt-2">Your contribution helps improve BC Advisor 4 Naija for everyone.</p>
        <button onClick={() => { setSubmitted(false); setRating(0); setComment(''); }} className="mt-8 text-medical-accent font-bold hover:underline">Send another response</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">Feedback & Support</h2>
        <p className="text-slate-500">Help us make this experience better for indigenous speakers.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-12">
        {/* General Rating */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Overall, how helpful was the advisor?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num} 
                onClick={() => setRating(num)}
                className={`p-2 transition-colors ${rating >= num ? 'text-medical-accent' : 'text-slate-200'}`}
              >
                <Star size={28} fill={rating >= num ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* SUS Questionnaire */}
        <div className="space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800">System Usability Scale (SUS)</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">Please rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
          </div>

          <div className="space-y-8">
            {SUS_QUESTIONS.map((question, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-sm font-medium text-slate-700">
                  <span className="text-medical-accent font-bold mr-2">{idx + 1}.</span>
                  {question}
                </p>
                <div className="flex items-center justify-between gap-2 max-w-sm">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSusChange(idx, val)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        susResponses[idx] === val 
                          ? 'bg-medical-accent border-medical-accent text-white shadow-lg' 
                          : 'border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between max-w-sm px-1">
                  <span className="text-[10px] text-slate-300 uppercase">Strongly Disagree</span>
                  <span className="text-[10px] text-slate-300 uppercase">Strongly Agree</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Additional Comments</label>
           <textarea 
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-medical-accent transition-all text-slate-700"
            placeholder="Tell us what you liked or what could be better..."
           ></textarea>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full py-4 bg-medical-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-30"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
