import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '@/data/menu'
import { ProductCard } from '@/components/menu/ProductCard'

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const activeCategory = searchParams.get('category') ?? 'all'

  const filtered = useMemo(() => {
    let items = PRODUCTS
    if (activeCategory !== 'all') {
      items = items.filter((p) => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [activeCategory, search])

  const setCategory = (id: string) => {
    if (id === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }
    setSearchParams(searchParams, { replace: true })
    setSearch('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/8 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 text-sm uppercase tracking-[0.25em] mb-2">
            What are you craving?
          </p>
          <h1
            className="font-display text-6xl text-white mb-6"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            OUR MENU
          </h1>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search pizzas, burgers, wings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-12 pr-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar categories */}
        <aside className="lg:w-52 shrink-0">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Categories</p>
          <div className="flex lg:flex-col gap-2 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${
                activeCategory === 'all'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-[#111] border border-white/8 text-white/70 hover:border-yellow-400/40 hover:text-white'
              }`}
            >
              🍽️ All Items
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${
                  activeCategory === cat.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-[#111] border border-white/8 text-white/70 hover:border-yellow-400/40 hover:text-white'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/50 text-sm">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' &&
                ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.name}`}
              {search && ` matching "${search}"`}
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-white/50 text-lg">No items found</p>
                <button
                  onClick={() => { setSearch(''); setCategory('all') }}
                  className="mt-4 text-yellow-400 text-sm hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
