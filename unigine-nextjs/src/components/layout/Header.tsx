'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import AuthModal from '@/components/auth/AuthModal'
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <header className={`header fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'active' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="logo">
              <Image
                src="/assets/images/logo.svg"
                width="110"
                height="53"
                alt="unigine home"
              />
            </Link>

            <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
              <ul className="navbar-list">
                <li className="navbar-item">
                  <Link href="/" className="navbar-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link href="/tournaments" className="navbar-link">Tournaments</Link>
                </li>
                <li className="navbar-item">
                  <Link href="/teams" className="navbar-link">Teams</Link>
                </li>
                <li className="navbar-item">
                  <Link href="/matches" className="navbar-link">Matches</Link>
                </li>
                <li className="navbar-item">
                  <Link href="/news" className="navbar-link">News</Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-white">
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="btn"
                >
                  Sign In
                </button>
              )}

              <button
                className={`nav-toggle-btn ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gainsboro" />
                ) : (
                  <Menu className="w-6 h-6 text-gainsboro" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}