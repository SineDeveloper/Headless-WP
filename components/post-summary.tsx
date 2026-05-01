'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PostSummaryProps {
  content: string;
}

export default function PostSummary({ content }: PostSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing. Please check your environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Summarize the following blog post content in 3 concise bullet points. Focus on the main takeaways. Use a professional and analytical tone.
      
      Content:
      ${content.replace(/<[^>]*>?/gm, '')} // Strip HTML tags
      
      Summary:`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setSummary(result.text || 'Could not generate summary.');
    } catch (err: any) {
      console.error('Summary generation error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-12 p-8 bg-zinc-900 text-zinc-100 rounded-2xl border border-zinc-800 relative overflow-hidden group shadow-lg shadow-black/20">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-12 h-12 text-indigo-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Intelligence Layer
          </div>
          {!summary && !isLoading && (
            <button
              onClick={generateSummary}
              className="bg-indigo-600 text-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 rounded-md"
            >
              Scan Data <Sparkles className="w-3 h-3" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 font-mono text-sm text-indigo-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" /> Fetching summary vectors...
            </motion.div>
          ) : summary ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert max-w-none"
            >
              <h4 className="font-mono text-[10px] uppercase tracking-widest mb-4 text-zinc-500">Executive Briefing</h4>
              <div className="text-sm font-sans leading-relaxed text-zinc-300 border-l border-zinc-800 pl-6">
                {summary}
              </div>
              <button 
                onClick={() => setSummary(null)}
                className="mt-6 font-mono text-[9px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                title="Clear cached sumary"
              >
                Reset Buffer
              </button>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/80 font-mono text-xs p-4 bg-red-400/5 border border-red-400/10 rounded-lg"
            >
              System Error: {error}
            </motion.div>
          ) : (
            <div className="font-serif italic text-xl text-zinc-500 leading-tight">
              Requesting metadata synthesis? Generate an AI summary for high-level technical comprehension.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
