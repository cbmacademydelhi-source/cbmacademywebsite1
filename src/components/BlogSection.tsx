import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BLOG_POSTS } from '../data/cbmData';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight, User, X } from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="blogs" className="relative overflow-hidden pt-8 sm:pt-10 pb-8 sm:pb-10 bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, ease: SMOOTH_EASE_OUT }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7200]/10 text-[#FF7200] text-xs font-bold uppercase tracking-wider border border-[#FF7200]/30"
            >
              Insights & Articles
            </motion.div>
            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
            >
              Digital Marketing & AI Insights
            </motion.h2>
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
              className="text-[#A7A7A7] text-base leading-relaxed"
            >
              Algorithmic updates, paid advertising strategies, and AI workflows curated by CBM mentors.
            </motion.p>
          </div>
        </div>

        {/* Responsive 3-Column Cards Grid - Consistent Card System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: index * 0.1, ease: SMOOTH_EASE_OUT }}
              className="bg-white/[0.04] hover:bg-white/[0.07] rounded-[20px] border border-white/[0.08] hover:border-white/[0.16] shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-[2.5px] transition-all duration-300 overflow-hidden flex flex-col justify-between backdrop-blur-xs group"
            >
              <div>
                {/* Featured Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.02]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D0D0D]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date & Read Time */}
                  <div className="flex items-center gap-3 text-xs text-[#A7A7A7] font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A7A7A7]" />
                      {post.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#A7A7A7]" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF7200] transition-colors leading-snug line-clamp-2 mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-[#A7A7A7] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Action: Author & Read More → */}
              <div className="px-6 pb-6 pt-3 border-t border-white/[0.08] flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#A7A7A7]">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white">{post.author.name}</span>
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  type="button"
                  id={`read-more-${post.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7200] hover:text-white transition-colors group/btn cursor-pointer"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

            </motion.article>
          ))}
        </div>

      </div>

      {/* Interactive Blog Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#0D0D0D] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/[0.12] relative text-white">
            
            <button
              onClick={() => setSelectedPost(null)}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-lg text-[#A7A7A7] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 mb-6">
              <span className="inline-block bg-[#FF7200]/10 text-[#FF7200] text-xs font-bold px-3 py-1 rounded-full border border-[#FF7200]/30">
                {selectedPost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-[#A7A7A7] pb-4 border-b border-white/[0.08]">
                <span className="font-semibold text-white">{selectedPost.author.name} ({selectedPost.author.role})</span>
                <span>&bull;</span>
                <span>{selectedPost.date}</span>
                <span>&bull;</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            {/* Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-white/[0.04]">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content text */}
            <div className="text-sm text-[#A7A7A7] leading-relaxed space-y-4">
              <p className="font-medium text-white text-base">
                {selectedPost.excerpt}
              </p>
              <p>
                {selectedPost.content}
              </p>
              <p>
                At CBM Academy, these strategic principles are built directly into our hands-on curriculum. Students don't just read about algorithms; they deploy live campaigns, analyze real Google Analytics 4 tracking events, and test prompt engineering frameworks in real time.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#A7A7A7] mr-1">Topics:</span>
              {selectedPost.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-white/[0.06] text-white px-2.5 py-1 rounded-md border border-white/[0.08]">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] text-right">
              <button
                onClick={() => setSelectedPost(null)}
                type="button"
                className="px-6 py-2.5 bg-[#FF7200] hover:bg-[#e06500] text-white font-bold text-xs rounded-xl shadow-[0_4px_16px_rgba(255,114,0,0.3)] transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
