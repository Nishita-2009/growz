import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { advisorService, AdvisorResponse } from '../../services/advisorService';
import { 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle,
  Loader2,
  Lightbulb
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What should I focus on this month?",
  "Why is my business growth slowing?",
  "How can I improve my profits?",
  "Which opportunity should I act on first?"
];

export const AskGrowzAISection: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisorResult, setAdvisorResult] = useState<AdvisorResponse | null>(null);

  const handleAsk = async (qText: string) => {
    const query = qText.trim();
    if (!query || loading) return;

    setLoading(true);
    setError(null);
    setQuestion(query);

    try {
      const res = await advisorService.askAdvisor(query);
      setAdvisorResult(res);
    } catch (err: any) {
      console.error("AI Advisor error:", err);
      setError("Growz AI is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask Growz AI</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight pt-1">
            AI Business Advisor
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
            Get instant, data-backed strategic advice derived from your live PostgreSQL business metrics.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-emerald-400 shadow-inner">
          <Bot className="h-6 w-6" />
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Questions</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              disabled={loading}
              className="text-xs text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 px-3 py-2 rounded-xl transition-all font-medium text-left flex items-center gap-1.5"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>{sq}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(question); }} className="relative flex items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Growz anything about your business..."
          disabled={loading}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-950" /> : <Send className="h-4 w-4" />}
        </button>
      </form>

      {/* Output States */}
      {loading && (
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
          <Loader2 className="h-6 w-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-medium">Growz is analyzing your business...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && !advisorResult && (
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs text-center italic">
          Ask Growz anything about your business.
        </div>
      )}

      {/* Advisor Result Output */}
      {!loading && advisorResult && (
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5 animate-fadeIn">
          {/* Question & Confidence */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs text-slate-400 italic">" {advisorResult.question} "</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Confidence: {advisorResult.confidence}
            </span>
          </div>

          {/* AI Answer */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">AI Answer</span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {advisorResult.answer}
            </p>
          </div>

          {/* Key Facts */}
          {advisorResult.key_facts && advisorResult.key_facts.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Key Business Facts</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {advisorResult.key_facts.map((fact, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action */}
          {advisorResult.recommended_action && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Recommended Next Action</span>
              <p className="text-xs text-emerald-300 font-semibold leading-relaxed">
                {advisorResult.recommended_action}
              </p>
            </div>
          )}

          {/* Related Opportunity Button */}
          {advisorResult.related_opportunity_id && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate('/app/opportunities')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>View Opportunity</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
