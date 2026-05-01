import { getPageBySlug } from '@/lib/api';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import { ArrowLeft, FileText, Info } from 'lucide-react';
import Link from 'next/link';

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <h1 className="font-serif italic text-4xl mb-4 text-zinc-100 font-normal">Page Not Initialized</h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8">Endpoint returned 404 for slug: {slug}</p>
        <Link href="/" className="font-mono text-sm uppercase tracking-widest flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Return to Root
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      
      <main className="relative max-w-5xl mx-auto px-6 py-20">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <header className="mb-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full mb-8">
            <Info className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Documentation / Page</span>
          </div>
          
          <h1 className="font-serif italic text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.8] tracking-tight text-white drop-shadow-sm">
            {page.title}
          </h1>

          {page.featuredImage?.node?.sourceUrl && (
            <div className="relative aspect-[21/9] w-full mb-20 overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl">
              <Image
                src={page.featuredImage.node.sourceUrl}
                alt={page.title}
                fill
                className="object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80" />
            </div>
          )}
        </header>

        <section className="relative z-10 max-w-3xl mx-auto">
          <div 
            className="prose prose-xl prose-invert font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          <div className="mt-32 p-12 bg-zinc-925 border border-zinc-900 rounded-3xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="font-bold text-zinc-100">End of Document</p>
                <p className="text-sm text-zinc-500">Last updated via WPGraphQL</p>
              </div>
            </div>
            <Link href="/" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
              Return to Feed
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 py-12 px-6 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600">
        System Node #{page.id.slice(0,8)} / Established 2024
      </footer>
    </div>
  );
}
