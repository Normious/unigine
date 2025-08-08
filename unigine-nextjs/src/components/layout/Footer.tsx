'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section footer-top">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <Image
                  src="/assets/images/logo.svg"
                  width="150"
                  height="73"
                  loading="lazy"
                  alt="Unigine logo"
                />
              </Link>

              <p className="footer-text">
                Our success in creating business solutions is due in large part
                to our talented and highly committed team.
              </p>

              <ul className="social-list">
                <li>
                  <a href="#" className="social-link">
                    <Facebook className="w-5 h-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Twitter className="w-5 h-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Instagram className="w-5 h-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Youtube className="w-5 h-5" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-list">
              <p className="title footer-list-title has-after">Quick Links</p>
              <ul>
                <li>
                  <Link href="/tournaments" className="footer-link">
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="footer-link">
                    Teams
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="footer-link">
                    Matches
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="footer-link">
                    News
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-list">
              <p className="title footer-list-title has-after">Support</p>
              <ul>
                <li>
                  <a href="#" className="footer-link">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-list">
              <p className="title footer-list-title has-after">Newsletter</p>
              <form className="footer-form">
                <input
                  type="email"
                  name="email_address"
                  required
                  placeholder="Your Email"
                  autoComplete="off"
                  className="input-field"
                />
                <button type="submit" className="btn">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container mx-auto px-4">
          <p className="copyright">
            &copy; 2024 Unigine Esports Platform. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}