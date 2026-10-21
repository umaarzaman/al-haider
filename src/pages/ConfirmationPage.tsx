import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { supabase, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function ConfirmationPage() {
  const { ref } = useParams<{ ref: string }>()
  const location = useLocation()
  const initialOrder = location.state?.order

  const [status, setStatus] = useState<OrderStatus>('pending')

  useEffect(() => {
    if (!ref || !supabase) return

    // Realtime subscription
    const channel = supabase
      .channel(`order-${ref}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `reference=eq.${ref}` },
        (payload) => {
          if (payload.new?.status) setStatus(payload.new.status as OrderStatus)
        }
      )
      .subscribe()

    return () => { if (supabase) supabase.removeChannel(channel) }
  }, [ref])

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Success icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-full mb-4"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h1 className="font-display text-5xl text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>ORDER PLACED!</h1>
          <p className="text-white/60">Thank you! We&apos;ve received your order.</p>
        </div>

        {/* Order ref */}
        <div className="bg-[#111] border border-white/8 rounded-xl p-6 mb-6 text-center">
          <p className="text-white/50 text-sm uppercase tracking-wider mb-2">Order Reference</p>
          <p className="text-yellow-400 font-display text-4xl tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>#{ref}</p>
          <p className="text-white/40 text-xs mt-2">Save this number to track your order</p>
        </div>

        {/* Status */}
        <div className="bg-[#111] border border-white/8 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h2 className="text-white font-semibold">Order Status</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-medium">{ORDER_STATUS_LABELS[status]}</span>
          </div>
          <p className="text-white/40 text-sm mt-3">
            We will prepare your order and have it ready for {status === 'pending' ? 'delivery/pickup' : 'you'} shortly.
          </p>
        </div>

        {/* Payment notice */}
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 mb-8 text-center">
          <p className="text-yellow-400 text-sm font-medium">💵 Payment: Cash on Delivery</p>
          <p className="text-white/50 text-xs mt-1">Please have cash ready when your order arrives.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link to={`/track/${ref}`}>Track Order <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button variant="secondary" asChild className="flex-1">
            <Link to="/menu">Order More</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
