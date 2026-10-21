import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore()
  const sub = subtotal()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart className="w-20 h-20 text-white/20 mb-6" />
        <h2 className="font-display text-4xl text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>YOUR CART IS EMPTY</h2>
        <p className="text-white/50 mb-8">Add some delicious items from our menu.</p>
        <Button asChild>
          <Link to="/menu"><ArrowLeft className="w-4 h-4" /> Browse Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-5xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>YOUR ORDER</h1>
          <button onClick={clearCart} className="text-white/40 hover:text-red-400 text-sm transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex items-center gap-4 bg-[#111] border border-white/8 rounded-xl p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-white/40 text-xs">{item.variantLabel}</p>
                    <p className="text-yellow-400 font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/30 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-[#111] border border-white/8 rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-white font-semibold text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span><span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Delivery</span>
                <span className="text-yellow-400 text-xs">Confirm with restaurant</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold">
                <span>Subtotal</span><span>{formatPrice(sub)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" asChild>
              <Link to="/checkout">Checkout <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Link to="/menu" className="block text-center text-yellow-400/70 hover:text-yellow-400 text-sm mt-4 transition-colors">
              ← Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
