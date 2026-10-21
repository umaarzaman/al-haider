import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="font-display text-black text-xl leading-none">AH</span>
              </div>
              <div>
                <p className="font-display text-xl text-white leading-none tracking-widest">AL HAIDER</p>
                <p className="text-yellow-400 text-xs tracking-[0.2em] uppercase">Fast Food</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Quick Bites, Big Dealight. Serving premium fast food with flavours you&apos;ll crave.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Menu' },
                { to: '/cart', label: 'Cart' },
                { to: '/track', label: 'Track Order' },
                { to: '/admin', label: 'Admin' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-yellow-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 uppercase tracking-wider text-sm">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-yellow-400 shrink-0" />
                <span>Address to be confirmed — please update in admin settings</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Contact number to be confirmed</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Opening hours to be confirmed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Al Haider Fast Food. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">Powered by modern web technology</p>
        </div>
      </div>
    </footer>
  )
}
