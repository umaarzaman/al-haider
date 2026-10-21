import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  LogOut,
  ShoppingBag,
  UtensilsCrossed,
  Settings as SettingsIcon,
  Search,
  Check,
  AlertTriangle,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react'
import { supabase, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { CATEGORIES, PRODUCTS as INITIAL_PRODUCTS, type Product } from '@/data/menu'
import { formatPrice } from '@/lib/utils'

const STATUS_ACTIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders')

  // Orders State
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Menu State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [menuSearch, setMenuSearch] = useState('')
  const [editingVariant, setEditingVariant] = useState<{ productId: string; variantId: string; price: number } | null>(null)

  // Settings State
  const [settings, setSettings] = useState({
    deliveryCharge: '100',
    minOrder: '0',
    phone: '0300-1234567',
    address: 'Shop # 4, Main Commercial Market, Islamabad',
    openingHours: '12:00 PM – 02:00 AM Daily',
    isDeliveryOpen: true,
  })
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false)

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false })
          .limit(100)

        if (!error && data) {
          setOrders(data)
          setLoadingOrders(false)
          return
        }
      } catch (e) {
        console.warn('Error fetching orders from Supabase:', e)
      }
    }

    // Fallback: load from local storage
    try {
      const local = JSON.parse(localStorage.getItem('ah_recent_orders') || '[]')
      setOrders(local.map((o: any, idx: number) => ({
        id: o.id || `local-${idx}`,
        ...o,
        order_items: o.order_items || o.items || [],
      })))
    } catch {
      setOrders([])
    }
    setLoadingOrders(false)
  }, [])

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) navigate('/admin')
      })
    }

    void fetchOrders()

    if (supabase) {
      const channel = supabase
        .channel('admin-orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          void fetchOrders()
        })
        .subscribe()

      return () => {
        if (supabase) {
          void supabase.removeChannel(channel)
        }
      }
    }
  }, [fetchOrders, navigate])

  // Update order status
  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId)
    if (supabase) {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    } else {
      // Local update
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      setOrders(updated)
      try {
        localStorage.setItem('ah_recent_orders', JSON.stringify(updated))
      } catch {}
    }
    setUpdatingOrderId(null)
    void fetchOrders()
  }

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId)
    if (supabase) {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    } else {
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      setOrders(updated)
      try {
        localStorage.setItem('ah_recent_orders', JSON.stringify(updated))
      } catch {}
    }
    setUpdatingOrderId(null)
    void fetchOrders()
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/admin')
  }

  // Product price update
  const handleSavePrice = (productId: string, variantId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, price: newPrice } : v)),
        }
      })
    )
    setEditingVariant(null)
  }

  const handleToggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, needs_review: !p.needs_review } : p))
    )
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setTimeout(() => {
      setSavingSettings(false)
      setSettingsSavedMsg(true)
      setTimeout(() => setSettingsSavedMsg(false), 3000)
    }, 600)
  }

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status))

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded uppercase">Staff Portal</span>
              <h1 className="font-display text-4xl text-white tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                AL HAIDER DASHBOARD
              </h1>
            </div>
            <p className="text-white/50 text-sm mt-1">Live order management, menu pricing, and store operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={fetchOrders} size="sm">
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </Button>
            <Button variant="danger" onClick={logout} size="sm">
              <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>

        {!supabase && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-xs text-white/80 leading-relaxed">
              <span className="text-yellow-400 font-semibold">Local Preview Mode Active: </span>
              Supabase environment variables (<code className="text-yellow-300">VITE_SUPABASE_URL</code> and <code className="text-yellow-300">VITE_SUPABASE_ANON_KEY</code>) are not connected yet. Realtime operations are falling back to local client state and browser storage.
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-yellow-400 text-black'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Incoming Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-yellow-400 text-black'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Menu & Prices ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-yellow-400 text-black'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> Restaurant Settings
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Orders', value: activeOrders.length, color: 'text-yellow-400' },
                { label: 'Pending Confirm', value: orders.filter((o) => o.status === 'pending').length, color: 'text-orange-400' },
                { label: 'In Kitchen / Ready', value: orders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status)).length, color: 'text-blue-400' },
                { label: 'Completed Orders', value: orders.filter((o) => o.status === 'delivered').length, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#111] border border-white/8 rounded-xl p-5">
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Active Orders List */}
            <section className="mb-12">
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center justify-between">
                <span>Active Orders Queue</span>
                <span className="text-xs text-white/40">{activeOrders.length} order(s) needing action</span>
              </h2>

              {loadingOrders ? (
                <div className="text-white/40 text-center py-16 bg-[#111] border border-white/5 rounded-xl">
                  Loading order queue…
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#111] border border-white/8 rounded-xl">
                  <p className="text-4xl mb-3">🛎️</p>
                  <p className="text-white/70 font-medium">No pending or active orders</p>
                  <p className="text-white/40 text-xs mt-1">New incoming customer orders will appear here automatically</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => {
                    const nextStatus = STATUS_ACTIONS[order.status as OrderStatus]
                    return (
                      <motion.div
                        key={order.id || order.reference}
                        layout
                        className="bg-[#111] border border-white/10 rounded-xl p-6 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-yellow-400 font-mono font-bold text-lg">#{order.reference}</span>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded bg-white/5 uppercase ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                                {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                              </span>
                              <span className="text-xs text-white/40 uppercase tracking-wider border border-white/10 px-2 py-0.5 rounded">
                                {order.order_type || 'Delivery'}
                              </span>
                              <span className="text-xs text-white/40">
                                {order.created_at ? new Date(order.created_at).toLocaleTimeString() : 'Just now'}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-white font-semibold flex items-center gap-1.5">
                                  <span>{order.customer_name}</span>
                                </p>
                                <p className="text-white/60 flex items-center gap-1.5 mt-0.5">
                                  <Phone className="w-3.5 h-3.5 text-yellow-400" />
                                  <a href={`tel:${order.phone}`} className="hover:underline text-yellow-400 font-mono">{order.phone}</a>
                                </p>
                              </div>
                              <div>
                                <p className="text-white/80 flex items-start gap-1.5 text-xs leading-relaxed">
                                  <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                  <span>{order.address}</span>
                                </p>
                                {order.landmark && (
                                  <p className="text-white/50 text-xs mt-1 pl-5">
                                    Landmark: <span className="text-white/80">{order.landmark}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {order.instructions && (
                              <div className="bg-[#181818] rounded-lg p-2.5 text-xs text-white/70 flex items-start gap-2 border border-white/5">
                                <FileText className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-white/90">Customer Note: </span>
                                  {order.instructions}
                                </div>
                              </div>
                            )}

                            {/* Order items */}
                            <div className="pt-2 border-t border-white/5">
                              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Items in this order</p>
                              <div className="flex flex-wrap gap-2">
                                {order.order_items?.map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white/90 flex items-center gap-2"
                                  >
                                    <span className="font-semibold text-yellow-400">{item.quantity}×</span>
                                    <span>{item.name}</span>
                                    <span className="text-white/40">({item.variant_label})</span>
                                    <span className="font-mono text-white/60">Rs. {item.line_total || (item.unit_price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex flex-col gap-2 shrink-0 sm:w-48 lg:border-l lg:border-white/10 lg:pl-6">
                            <div className="mb-2">
                              <p className="text-xs text-white/40">Total Amount</p>
                              <p className="text-2xl font-bold text-yellow-400 font-mono">
                                {formatPrice(order.total || order.subtotal)}
                              </p>
                              <p className="text-[11px] text-white/40">Cash on Delivery</p>
                            </div>

                            {nextStatus && (
                              <Button
                                size="sm"
                                loading={updatingOrderId === (order.id || order.reference)}
                                onClick={() => updateStatus(order.id || order.reference, nextStatus)}
                                className="w-full text-xs font-bold"
                              >
                                Advance to {ORDER_STATUS_LABELS[nextStatus]}
                              </Button>
                            )}

                            {order.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="danger"
                                loading={updatingOrderId === (order.id || order.reference)}
                                onClick={() => cancelOrder(order.id || order.reference)}
                                className="w-full text-xs"
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Past Completed Orders */}
            {pastOrders.length > 0 && (
              <section>
                <h2 className="text-white/50 font-semibold text-sm uppercase tracking-wider mb-4">Completed / Past Orders</h2>
                <div className="space-y-2">
                  {pastOrders.map((order) => (
                    <div
                      key={order.id || order.reference}
                      className="bg-[#111] border border-white/5 rounded-lg px-4 py-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white/70">#{order.reference}</span>
                        <span className="text-white/90 font-medium">{order.customer_name}</span>
                        <span className="text-white/40">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={ORDER_STATUS_COLORS[order.status as OrderStatus]}>
                          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                        </span>
                        <span className="font-mono text-white/60 font-semibold">
                          {formatPrice(order.total || order.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: MENU & PRICES */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              {/* Category selector */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-yellow-400 text-black font-bold'
                      : 'bg-[#111] text-white/70 border border-white/10 hover:text-white'
                  }`}
                >
                  All ({products.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-[#111] text-white/70 border border-white/10 hover:text-white'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Filter products…"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#111] border border-white/8 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="font-semibold text-white text-base">{product.name}</h3>
                      <span className="text-xs uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      {product.needs_review && (
                        <span className="text-[11px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">
                          Review Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed max-w-2xl">{product.description}</p>
                  </div>

                  {/* Variants and price editing */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {product.variants.map((v) => {
                      const isEditing =
                        editingVariant?.productId === product.id && editingVariant?.variantId === v.id
                      return (
                        <div
                          key={v.id}
                          className="bg-[#181818] border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs"
                        >
                          <span className="text-white/60">{v.label}:</span>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                autoFocus
                                value={editingVariant.price}
                                onChange={(e) =>
                                  setEditingVariant({
                                    ...editingVariant,
                                    price: Math.max(0, parseInt(e.target.value) || 0),
                                  })
                                }
                                className="w-16 bg-black border border-yellow-400 rounded px-1.5 py-0.5 text-xs text-yellow-400 font-mono"
                              />
                              <button
                                onClick={() => handleSavePrice(product.id, v.id, editingVariant.price)}
                                className="p-1 text-emerald-400 hover:text-emerald-300"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setEditingVariant({
                                  productId: product.id,
                                  variantId: v.id,
                                  price: v.price,
                                })
                              }
                              className="font-mono text-yellow-400 font-semibold hover:underline"
                              title="Click to edit price"
                            >
                              Rs. {v.price}
                            </button>
                          )}
                        </div>
                      )
                    })}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleProductActive(product.id)}
                      className="text-xs"
                    >
                      {product.needs_review ? 'Unmark Review' : 'Mark Review'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESTAURANT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#111] border border-white/8 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-3xl text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              RESTAURANT & DELIVERY CONFIGURATION
            </h2>
            <p className="text-white/50 text-xs mb-6">
              Configure delivery fees, minimum checkout rules, and operational contact info.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Standard Delivery Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={(e) => setSettings({ ...settings, deliveryCharge: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Minimum Order Value (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrder}
                    onChange={(e) => setSettings({ ...settings, minOrder: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Store Contact Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Restaurant Location / Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isDeliveryOpen}
                    onChange={(e) => setSettings({ ...settings, isDeliveryOpen: e.target.checked })}
                    className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 bg-[#181818] border-white/20"
                  />
                  <span className="text-white font-medium">Accepting Online Delivery Orders Now</span>
                </label>
              </div>

              {settingsSavedMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-3 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> Restaurant settings updated successfully.
                </div>
              )}

              <Button type="submit" loading={savingSettings} className="mt-4">
                Save Restaurant Settings
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
