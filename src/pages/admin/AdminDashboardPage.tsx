import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, LogOut, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { supabase, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

const STATUS_ACTIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(50)
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    supabase?.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate('/admin')
    })
    fetchOrders()

    const channel = supabase?.channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()

    return () => { if (channel) supabase?.removeChannel(channel) }
  }, [])

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!supabase) return
    setUpdating(orderId)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setUpdating(null)
    fetchOrders()
  }

  const cancelOrder = async (orderId: string) => {
    if (!supabase) return
    setUpdating(orderId)
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    setUpdating(null)
    fetchOrders()
  }

  const logout = async () => {
    await supabase?.auth.signOut()
    navigate('/admin')
  }

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status))

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>ORDER DASHBOARD</h1>
            <p className="text-white/50 text-sm">Al Haider Fast Food — Admin</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={fetchOrders} size="sm">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Button variant="danger" onClick={logout} size="sm">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {!supabase && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-6 mb-8">
            <p className="text-yellow-400 font-semibold">⚠️ Supabase not configured</p>
            <p className="text-white/60 text-sm mt-1">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Orders', value: activeOrders.length, color: 'text-yellow-400' },
            { label: 'Delivered Today', value: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-400' },
            { label: 'Total Orders', value: orders.length, color: 'text-white' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#111] border border-white/8 rounded-xl p-5">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-white/50 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Active Orders */}
        <section className="mb-10">
          <h2 className="text-yellow-400 text-sm uppercase tracking-wider font-semibold mb-4">Active Orders</h2>
          {loading ? (
            <div className="text-white/40 text-center py-10">Loading…</div>
          ) : activeOrders.length === 0 ? (
            <div className="text-white/30 text-center py-10 bg-[#111] border border-white/8 rounded-xl">
              No active orders
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-[#111] border border-white/8 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-yellow-400 font-mono font-bold">#{order.reference}</span>
                        <span className={`text-xs font-semibold ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                        </span>
                      </div>
                      <p className="text-white font-medium">{order.customer_name} — {order.phone}</p>
                      <p className="text-white/50 text-sm truncate">{order.address}</p>
                      <p className="text-white/40 text-xs mt-1">
                        {order.order_items?.length} item(s) · Rs. {order.subtotal?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {STATUS_ACTIONS[order.status as OrderStatus] && (
                        <Button
                          size="sm"
                          loading={updating === order.id}
                          onClick={() => updateStatus(order.id, STATUS_ACTIONS[order.status as OrderStatus]!)}
                        >
                          → {ORDER_STATUS_LABELS[STATUS_ACTIONS[order.status as OrderStatus]!]}
                        </Button>
                      )}
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <Button
                          size="sm"
                          variant="danger"
                          loading={updating === order.id}
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Items list */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                    {order.order_items?.map((item: any) => (
                      <span key={item.id} className="text-xs bg-white/5 text-white/60 rounded px-2 py-1">
                        {item.name} ({item.variant_label}) ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Past orders */}
        {pastOrders.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white/40 text-sm uppercase tracking-wider font-semibold mb-4">Recent History</h2>
            <div className="space-y-2">
              {pastOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-[#111] border border-white/5 rounded-lg px-4 py-3 text-sm">
                  <span className="text-white/40 font-mono">#{order.reference}</span>
                  <span className="text-white/60">{order.customer_name}</span>
                  <span className={ORDER_STATUS_COLORS[order.status as OrderStatus]}>
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </span>
                  <span className="text-white/40">Rs. {order.subtotal?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
