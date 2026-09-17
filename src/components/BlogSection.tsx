import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BLOG_POSTS } from '../data/cbmData';
import { BlogPost } from '../types';
import { Calendar, Clock, ArrowRight, User, X, BookOpen, Share2 } from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="blogs" className="pt-8 sm:pt-10 pb-8 sm:pb-10 bg-transparent border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, ease: SMOOTH_EASE_OUT }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100"
            >
              Insights & Articles
            </motion.div>
            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight"
            >
              Digital Marketing & AI Insights
            </motion.h2>
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
              className="text-slate-600 text-base leading-relaxed"
            >
              Algorithmic updates, paid advertising strategies, and AI workflows curated by CBM mentors.
            </motion.p>
          </div>
        </div>

        {/* Responsive 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: index * 0.1, ease: SMOOTH_EASE_OUT }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between cbm-shadow hover:shadow-[0_12px_28px_-4px_rgba(15,23,42,0.08)] hover:-translate-y-[2.5px] transition-all duration-300 hover:border-slate-300 group"
            >
              <div>
                {/* Featured Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#072B57] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date & Read Time */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#072B57] group-hover:text-[#FF6B00] transition-colors leading-snug line-clamp-2 mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Action: Author & Read More → */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#072B57]">{post.author.name}</span>
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  type="button"
                  id={`read-more-${post.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:text-[#072B57] transition-colors group/btn"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            
            <button
              onClick={() => setSelectedPost(null)}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 mb-6">
              <span className="inline-block bg-orange-50 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                {selectedPost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#072B57] leading-tight">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="font-semibold text-[#072B57]">{selectedPost.author.name} ({selectedPost.author.role})</span>
                <span>&bull;</span>
                <span>{selectedPost.date}</span>
                <span>&bull;</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            {/* Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-slate-100">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content text */}
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
              <p className="font-medium text-[#072B57] text-base">
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
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Topics:</span>
              {selectedPost.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-slate-100 text-[#072B57] px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedPost(null)}
                type="button"
                className="px-6 py-2.5 bg-[#072B57] text-white font-bold text-xs rounded-xl hover:bg-[#0c3c78] transition-colors"
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
