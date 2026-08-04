import React from 'react';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { toSlug, navigateTo } from '../utils/router';
import { BlogPost } from '../pages/BlogPage';
import { BlogCardSkeleton } from './ui/Skeleton';

interface BlogGridSectionProps {
  filteredPosts: BlogPost[];
  bookmarkedPosts?: Record<string, boolean>;
  likedPosts: Record<string, boolean>;
  postLikes: Record<string, number>;
  copiedCardId: string | null;
  onSelectPostId: (slug: string) => void;
  handleLike: (id: string, e: React.MouseEvent) => void;
  handleShareCard: (post: BlogPost, e: React.MouseEvent) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const BlogGridSection: React.FC<BlogGridSectionProps> = ({
  filteredPosts,
  bookmarkedPosts = {},
  likedPosts,
  postLikes,
  copiedCardId,
  onSelectPostId,
  handleLike,
  handleShareCard,
  onResetFilters,
  isLoading = false,
}) => {
  return (
    <section className="py-12 md:py-16" id="blog-grid-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const likesCount = postLikes[post.id] ?? post.likes;

              return (
                <a
                  key={post.id}
                  href={`/blog/${toSlug(post.title)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPostId(toSlug(post.title));
                    navigateTo(`/blog/${toSlug(post.title)}`);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group h-full block"
                >
                  {/* Post image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#111215]/90 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm z-10">
                      {post.category}
                    </span>

                    {/* Share button */}
                    <button
                      onClick={(e) => handleShareCard(post, e)}
                      title="Compartir artículo"
                      className={`absolute top-4 right-4 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer z-10 ${
                        copiedCardId === post.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 text-[#111215] hover:bg-white hover:text-[#ff0d41]'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedCardId === post.id ? '¡Enlace copiado!' : 'Compartir'}</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Meta info */}
                      <div className="flex items-center text-[11px] font-bold text-slate-400 gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-[#111215] group-hover:text-[#ff0d41] transition-colors tracking-tight leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer with author and small interactions */}
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      {/* Author details */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-100"
                        />
                        <div className="text-left">
                          <span className="block text-[11px] font-extrabold text-slate-700 leading-none">
                            {post.author.name}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 block mt-0.5">
                            {post.author.role}
                          </span>
                        </div>
                      </div>

                      {/* Interaction buttons */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          onClick={(e) => handleShareCard(post, e)}
                          className={`flex items-center gap-1 text-[11px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer ${
                            copiedCardId === post.id
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-400 hover:text-[#ff0d41] hover:bg-slate-50'
                          }`}
                          title="Compartir artículo"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{copiedCardId === post.id ? '¡Copiado!' : 'Compartir'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg text-slate-500 font-medium">
              No se han encontrado artículos que coincidan con tu búsqueda.
            </p>
            <button
              onClick={onResetFilters}
              className="text-sm font-bold text-[#ff0d41] hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGridSection;
