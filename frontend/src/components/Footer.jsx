import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-teal-700/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="text-2xl font-extrabold text-teal-400">FlatBuddy</div>
            <p className="mt-3 text-sm text-neutral-400 max-w-xs">Trusted real-estate marketplace helping buyers and sellers make confident decisions.</p>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-200">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li><Link to="/about" className="hover:text-neutral-200">About</Link></li>
              <li><a href="#careers" className="hover:text-neutral-200">Careers</a></li>
              <li><a href="#press" className="hover:text-neutral-200">Press</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-200">Listings</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li><Link to="/listings" className="hover:text-neutral-200">Buy</Link></li>
              <li><Link to="/listings" className="hover:text-neutral-200">Rent</Link></li>
              <li><Link to="/add" className="hover:text-neutral-200">Sell with us</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-200">Support</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li><Link to="/contact" className="hover:text-neutral-200">Contact</Link></li>
              <li><a href="#help" className="hover:text-neutral-200">Help Center</a></li>
              <li><a href="#policy" className="hover:text-neutral-200">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-800 pt-6 text-sm text-neutral-400 md:flex-row">
          <p>© {new Date().getFullYear()} FlatBuddy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-neutral-200">X</a>
            <a href="#" aria-label="Instagram" className="hover:text-neutral-200">IG</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-neutral-200">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
