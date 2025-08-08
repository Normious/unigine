'use client'

import { Calendar, User, Eye } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

interface NewsArticle {
  id: string
  title: string
  excerpt: string | null
  featured_image: string | null
  category: string
  author: {
    username: string
    full_name: string | null
  }
  published_at: string | null
  created_at: string
}

interface NewsCardProps {
  article: NewsArticle
  onRead?: (articleId: string) => void
}

export default function NewsCard({ article, onRead }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tournament': return 'bg-blue-500'
      case 'team': return 'bg-green-500'
      case 'player': return 'bg-yellow-500'
      case 'game': return 'bg-purple'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-oxford-blue-alpha-90 rounded-lg overflow-hidden shadow-lg border border-purple-alpha-30 hover:border-purple transition-colors">
      {article.featured_image && (
        <div className="relative h-48 w-full">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {!article.featured_image && (
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        {article.excerpt && (
          <p className="text-gainsboro mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-champagne-pink text-sm mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1 text-purple" />
            <span>{article.author.full_name || article.author.username}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-purple" />
            <span>
              {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        {onRead && (
          <button
            onClick={() => onRead(article.id)}
            className="w-full btn flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Read More
          </button>
        )}
      </div>
    </div>
  )
}