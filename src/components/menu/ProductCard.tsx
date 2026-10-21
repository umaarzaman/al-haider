import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, AlertCircle } from 'lucide-react'
import { type Product } from '@/data/menu'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const CATEGORY_EMOJIS: Record<string, string> = {
  pizza: '🍕',
  burger: '🍔',
  fries: '🍟',
  sandwich: '🥪',
  wings: '🍗',
  pasta: '🍝',
  wrap: '🌯',
  broast: '🍖',
  soup: '🍲',
  drinks: '🥤',
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const selectedVariant = product.variants[selectedVariantIdx]

  const handleAdd = () => {
    if (!selectedVariant || selectedVariant.price === 0) return
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantLabel: selectedVariant.label,
      price: selectedVariant.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const emoji = CATEGORY_EMOJIS[product.category] ?? '🍽️'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      className="bg-[#111] border border-white/8 rounded-xl overflow-hidden flex flex-col"
    >
      {/* Image / emoji placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
        <span className="text-7xl select-none">{emoji}</span>
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {product.tags?.includes('bestseller') && <Badge variant="gold">Bestseller</Badge>}
          {product.tags?.includes('popular') && <Badge variant="gold">Popular</Badge>}
          {product.tags?.includes('spicy') && <Badge variant="red">🌶 Spicy</Badge>}
          {product.tags?.includes('premium') && <Badge variant="gray">Premium</Badge>}
          {product.tags?.includes('family') && <Badge variant="green">Family</Badge>}
        </div>
        {product.needs_review && (
          <div className="absolute top-3 right-3" title="Price needs review">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-white text-base leading-snug">{product.name}</h3>
          <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIdx(idx)}
                className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
                  idx === selectedVariantIdx
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'border-white/20 text-white/60 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-yellow-400 font-bold text-lg">
            {selectedVariant?.price === 0 ? 'Ask staff' : formatPrice(selectedVariant?.price ?? 0)}
          </span>
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-emerald-400 text-sm font-semibold"
              >
                ✓ Added!
              </motion.span>
            ) : (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={selectedVariant?.price === 0}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
