import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { supabase, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

const STATUS_STEPS: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered',
]

export function TrackOrderPage() {
  const { ref: paramRef } = useParams<{ ref?: string }>()
  const navigate = useNavigate()
  const [inputRef, setInputRef] = useState(paramRef ?? '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async (reference: string) => {
    if (!supabase) {
      setError('Order tracking requires Supabase configuration.')
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('reference', reference.toUpperCase())
      .single()
    setLoading(false)
    if (err || !data) {
      setError('Order not found. Check your reference number.')
    } else {
      setOrder(data)
    }
  }

  useEffect(() => {
    if (paramRef) fetchOrder(paramRef)
  }, [paramRef])

  useEffect(() => {
    if (!order || !supabase) return
    const channel = supabase
      .channel(`track-${order.reference}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${order.id}`,
      }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }))
      })
      .subscribe()
    return () => { if (supabase) supabase.removeChannel(channel) }
  }, [order?.id])

  const currentStepIdx = order ? STATUS_STEPS.indexOf(order.status as OrderStatus) : -1

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="font-display text-5xl text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>TRACK ORDER</h1>
        <p className="text-white/50 mb-8">Enter your order reference to see its status.</p>

        <div className="flex gap-3 mb-10">
          <input
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value.toUpperCase())}
            placeholder="e.g. AHK2X8QP"
            maxLength={8}
            className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 font-mono uppercase tracking-widest"
          />
          <Button onClick={() => fetchOrder(inputRef)} loading={loading} disabled={inputRef.length < 4}>
            <Search className="w-4 h-4" /> Track
          </Button>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-4 mb-6">{error}</p>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#111] border border-white/8 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Order Ref</p>
                  <p className="text-yellow-400 font-mono font-bold text-xl">#{order.reference}</p>
                </div>
                <span className={`text-sm font-semibold ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </span>
              </div>

              {/* Progress steps */}
              {order.status !== 'cancelled' && (
                <div className="flex items-center gap-1 mt-4">
                  {STATUS_STEPS.map((step, idx) => (
                    <React.Fragment key={step}>
                      <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                        idx <= currentStepIdx ? 'bg-yellow-400' : 'bg-white/10'
                      }`} />
                      {idx < STATUS_STEPS.length - 1 && <div className="w-0.5" />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40">Customer</p>
                  <p className="text-white">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-white/40">Phone</p>
                  <p className="text-white">{order.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-white/40">Address</p>
                  <p className="text-white">{order.address}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[#111] border border-white/8 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-2">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.name} ({item.variant_label}) ×{item.quantity}</span>
                    <span className="text-white font-medium">Rs. {item.line_total?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>Rs. {order.total?.toLocaleString() ?? order.subtotal?.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
