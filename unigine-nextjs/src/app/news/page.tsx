'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/news/NewsCard'
import { Search, Filter, Plus } from 'lucide-react'

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

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchNews()
  }, [categoryFilter])

  const fetchNews = async () => {
    try {
      let query = supabase
        .from('news')
        .select(`
          *,
          author:profiles!news_author_id_fkey(username, full_name)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleReadArticle = (articleId: string) => {
    // TODO: Navigate to article details page
    console.log('Read article:', articleId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-purple pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple mx-auto"></div>
            <p className="text-gainsboro mt-4">Loading news...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-purple pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">News & Updates</h1>
          <p className="text-gainsboro max-w-2xl mx-auto">
            Stay updated with the latest news, tournament results, and esports industry insights.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-oxford-blue-alpha-90 border border-purple-alpha-30 rounded text-white placeholder-gainsboro focus:outline-none focus:border-purple"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-oxford-blue-alpha-90 border border-purple-alpha-30 rounded px-4 py-3 text-white focus:outline-none focus:border-purple"
              >
                <option value="all">All Categories</option>
                <option value="tournament">Tournament</option>
                <option value="team">Team</option>
                <option value="player">Player</option>
                <option value="game">Game</option>
              </select>
            </div>
          </div>

          <button className="btn flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Write Article
          </button>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gainsboro text-lg">
              {searchTerm ? 'No articles found matching your search.' : 'No articles found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onRead={handleReadArticle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}