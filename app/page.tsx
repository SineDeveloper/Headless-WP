import { getAllPosts, getHomePage } from '@/lib/api';
import Navbar from '@/components/navbar';
import PostCard from '@/components/post-card';
import BridgeStatus from '@/components/bridge-status';
import { Terminal, Sparkles } from 'lucide-react';

export default async function Home() {
  const posts = await getAllPosts();
  const homePage: any = await getHomePage();

  // If homePage is null and no posts are found, likely a 404/Connection issue
  if (!homePage && (!posts || posts.length === 0)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <BridgeStatus type="404" />
      </div>
    );
  }

  // Handle case where query worked but custom fields were stripped (fallback mode)
  if (homePage?._metadata_missing) {
    console.warn('UI WARNING: Custom Metadata (ACF/SCF) is missing from the schema. Page is rendering with default styles.');
  }

  const metadata = homePage?.acf || homePage?.scf;
  const accentColor = metadata?.accent_color || '#6366f1';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ '--accent': accentColor } as any}>
      <Navbar />
      
      <main className={`relative py-20 ${metadata?.hero_full_width ? '' : 'max-w-7xl mx-auto px-6'}`}>
        <div 
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-10"
          style={{ backgroundColor: 'var(--accent)' }}
        />

        <header className={`mb-24 relative z-10 ${metadata?.hero_full_width ? 'max-w-7xl mx-auto px-6' : ''}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full mb-8">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {metadata?.system_id ? `Active Node: ${metadata.system_id}` : 'System v4.2 Active'}
                </span>
              </div>

              {metadata?.subtitle && (
                <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-zinc-500 mb-4">
                  {metadata.subtitle}
                </div>
              )}

              <h1 className="font-serif italic text-6xl md:text-8xl lg:text-9xl leading-[0.8] tracking-tight text-white mb-8">
                {homePage?.title || "Headless"}<br />
                <span className="text-zinc-700">{homePage?.title ? "Interface" : "Development"}</span>
              </h1>
              
              {homePage?.content ? (
                <div 
                  className="prose prose-invert prose-xl font-sans text-zinc-400 leading-relaxed max-w-2xl mt-12 mb-12"
                  dangerouslySetInnerHTML={{ __html: homePage.content }}
                />
              ) : (
                <p className="font-sans text-xl text-zinc-400 leading-relaxed max-w-xl mt-8">
                  A high-performance blog architecture bridging the gap between WordPress core and modern reactive frontend logic.
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-4 min-w-[240px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Response</p>
                  <p className="text-xl font-semibold text-zinc-100">12ms</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Status</p>
                  <p className="text-xl font-semibold text-emerald-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className={`mt-32 ${metadata?.hero_full_width ? 'max-w-7xl mx-auto px-6' : ''}`}>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] flex-grow bg-zinc-800" />
            <h2 className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500 font-bold whitespace-nowrap">Latest Journal Entries</h2>
            <div className="h-[1px] flex-grow bg-zinc-800" />
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border border-dashed border-zinc-800 rounded-3xl">
              <p className="font-serif italic text-3xl text-zinc-600">Buffer empty.</p>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-4 text-zinc-500">
                Ensure your posts are public and GraphQL endpoint is correct.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-925 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-zinc-100">HeadlessWP</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Crafting high-performance digital experiences through headless architecture and distributed data layers.
            </p>
            {metadata?.system_id && (
              <div className="mt-6 font-mono text-[9px] uppercase tracking-widest text-zinc-700">
                System Interface Node: {metadata.system_id}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-zinc-100 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
