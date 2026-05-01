'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
      };
    };
    author?: {
      node: {
        name: string;
        avatar?: {
          url: string;
        };
      };
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/posts/${post.slug}`} className="block h-full bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/50 transition-all p-6 rounded-2xl overflow-hidden shadow-sm hover:shadow-indigo-500/10">
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-xl bg-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-700">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-indigo-400" /> {formattedDate}
          </span>
          {post.author?.node?.name && (
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-indigo-400" /> {post.author.node.name}
            </span>
          )}
        </div>

        <h3 className="font-serif italic text-2xl mb-4 text-zinc-100 group-hover:text-white transition-colors leading-tight">
          {post.title}
        </h3>

        <div 
          className="text-zinc-500 text-sm line-clamp-3 mb-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <ArrowRight className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-100 transition-colors">Open File</span>
          </div>
          <div className="text-[8px] font-mono text-zinc-700 uppercase">
            # {post.id.slice(0, 8)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
