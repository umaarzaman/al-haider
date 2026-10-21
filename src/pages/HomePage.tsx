import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, Star, Zap, Clock, Shield } from 'lucide-react'
import { HeroScene } from '@/components/3d/HeroScene'
import { ProductCard } from '@/components/menu/ProductCard'
import { Button } from '@/components/ui/Button'
import { PRODUCTS, CATEGORIES, FEATURED_PRODUCTS } from '@/data/menu'

const STATS = [
  { icon: Star, label: 'Premium Quality', value: '100%' },
  { icon: Zap, label: 'Fast Delivery', value: 'Quick' },
  { icon: Clock, label: 'Always Fresh', value: 'Daily' },
  { icon: Shield, label: 'Hygiene First', value: 'Safe' },
]

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const featuredProducts = FEATURED_PRODUCTS.map((id) =>
    PRODUCTS.find((p) => p.id === id)
  ).filter(Boolean) as typeof PRODUCTS

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        {/* 3D Scene */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 z-0"
        >
          <HeroScene />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Hero copy */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-yellow-400 text-sm uppercase tracking-[0.3em] font-semibold mb-4">
              Quick Bites · Big Dealight
            </p>
            <h1
              className="font-display text-7xl sm:text-8xl lg:text-9xl text-white leading-none mb-6"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              AL HAIDER
              <br />
              <span className="text-yellow-400">FAST FOOD</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md mb-8 leading-relaxed">
              Premium pizzas, sizzling burgers, crispy broast, and much more —
              crafted fresh for every order.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/menu">
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/menu">View Menu</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/30"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-white/8 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-yellow-400 text-sm uppercase tracking-[0.25em] mb-2">Browse by</p>
          <h2
            className="font-display text-5xl text-white"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            CATEGORIES
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={`/menu?category=${cat.id}`}
                className="flex flex-col items-center gap-3 p-5 bg-[#111] border border-white/8 rounded-xl hover:border-yellow-400/40 hover:bg-[#161616] transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-white/80 group-hover:text-yellow-400 text-center transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-yellow-400 text-sm uppercase tracking-[0.25em] mb-2">Customer Favourites</p>
            <h2
              className="font-display text-5xl text-white"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              FEATURED ITEMS
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden md:flex items-center gap-2 text-yellow-400 text-sm font-semibold hover:gap-3 transition-all"
          >
            Full Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Button asChild variant="secondary">
            <Link to="/menu">View Full Menu <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="py-20 bg-[#111] border-y border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-yellow-400 text-sm uppercase tracking-[0.25em] mb-4">Our Story</p>
              <h2
                className="font-display text-5xl text-white mb-6"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                CRAFTED WITH
                <br />
                <span className="text-yellow-400">PASSION</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Al Haider Fast Food was built on a simple promise: deliver bold flavours,
                fresh ingredients, and an unforgettable dining experience — every single time.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                From our signature AH Special Pizza to our legendary Lava Burger, every item
                on our menu is crafted with care and served with pride.
              </p>
              <Button asChild>
                <Link to="/menu">
                  Explore Menu <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {['🍕', '🍔', '🍗', '🌯'].map((emoji, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#1a1a1a] border border-white/8 rounded-2xl flex items-center justify-center text-6xl hover:border-yellow-400/40 transition-colors"
                >
                  {emoji}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-display text-6xl sm:text-8xl text-white mb-4"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            HUNGRY? <span className="text-yellow-400">ORDER NOW.</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Cash on delivery · Fresh daily · Quick service
          </p>
          <Button size="lg" asChild>
            <Link to="/menu">Start Your Order <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
