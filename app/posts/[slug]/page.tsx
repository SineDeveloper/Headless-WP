import { getPostBySlug } from '@/lib/api';
import Navbar from '@/components/navbar';
import PostSummary from '@/components/post-summary';
import Image from 'next/image';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <h1 className="font-serif italic text-4xl mb-4 text-zinc-100">Null Pointer</h1>
        <Link href="/" className="font-mono text-sm uppercase tracking-widest flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Return to Root
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-zinc-100 transition-colors mb-12">
          <ArrowLeft className="w-3 h-3 text-indigo-400" /> Back to Workspace
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <Calendar className="w-3 h-3 text-indigo-400" /> {formattedDate}
            </span>
            {post.author?.node?.name && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                <User className="w-3 h-3 text-indigo-400" /> {post.author.node.name}
              </span>
            )}
          </div>

          <h1 className="font-serif italic text-4xl md:text-6xl lg:text-7xl mb-12 leading-[0.9] tracking-tight text-white">
            {post.title}
          </h1>

          {post.featuredImage?.node?.sourceUrl && (
            <div className="relative aspect-[21/9] w-full mb-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                fill
                className="object-cover opacity-80"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>
          )}
        </header>

        <PostSummary content={post.content} />

        <div 
          className="prose prose-lg max-w-none prose-invert font-sans leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="mt-20 pt-10 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Distributed via <span className="text-zinc-300">Headless_WP</span>
            </div>
            <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest font-bold text-indigo-400">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition-colors">Email</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
