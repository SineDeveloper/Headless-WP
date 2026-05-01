'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans font-bold tracking-tight text-lg text-zinc-100">
            Headless<span className="text-zinc-500">WP</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
            <Link href="/" className="text-[11px] font-bold uppercase tracking-wider text-zinc-100 hover:text-indigo-400 transition-colors">Stories</Link>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors">Docs</Link>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors">API</Link>
          </div>
          
          <button className="bg-zinc-100 text-zinc-950 px-4 py-1.5 text-xs font-bold rounded-md hover:bg-white transition-all shadow-sm">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
