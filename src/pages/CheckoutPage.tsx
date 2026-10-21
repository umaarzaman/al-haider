import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, generateOrderRef } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  address: z.string().min(10, 'Please enter your full delivery address'),
  landmark: z.string().optional(),
  instructions: z.string().optional(),
  orderType: z.enum(['delivery', 'pickup']),
})

type FormData = z.infer<typeof schema>

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-white/70 text-sm font-medium">
        {label}{required && <span className="text-yellow-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { orderType: 'delivery' },
  })

  const orderType = watch('orderType')
  const sub = subtotal()

  if (items.length === 0) {
    navigate('/menu')
    return null
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setSubmitError(null)
    const ref = generateOrderRef()

    const orderPayload = {
      reference: ref,
      customer_name: data.customerName,
      phone: data.phone,
      address: data.orderType === 'delivery' ? data.address : 'Pickup',
      landmark: data.landmark ?? null,
      instructions: data.instructions ?? null,
      order_type: data.orderType,
      status: 'pending',
      payment_method: 'cash_on_delivery',
      subtotal: sub,
      delivery_charge: data.orderType === 'delivery' ? null : 0,
      total: sub,
      items: items.map((i) => ({
        product_id: i.productId,
        variant_id: i.variantId,
        name: i.name,
        variant_label: i.variantLabel,
        unit_price: i.price,
        quantity: i.quantity,
        line_total: i.price * i.quantity,
      })),
    }

    try {
      if (supabase) {
        const { data: order, error } = await supabase
          .from('orders')
          .insert({
            reference: orderPayload.reference,
            customer_name: orderPayload.customer_name,
            phone: orderPayload.phone,
            address: orderPayload.address,
            landmark: orderPayload.landmark,
            instructions: orderPayload.instructions,
            order_type: orderPayload.order_type,
            status: orderPayload.status,
            payment_method: orderPayload.payment_method,
            subtotal: orderPayload.subtotal,
            delivery_charge: orderPayload.delivery_charge,
            total: orderPayload.total,
          })
          .select('id')
          .single()

        if (error) throw error

        const orderItems = orderPayload.items.map((item) => ({
          order_id: order.id,
          ...item,
        }))
        await supabase.from('order_items').insert(orderItems)
      }

      clearCart()
      navigate(`/confirmation/${ref}`, { state: { order: orderPayload } })
    } catch (err: any) {
      console.error('Order submission error:', err)
      setSubmitError(
        'Failed to place your order. Please try again or call us directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </button>

        <h1 className="font-display text-5xl text-white mb-10" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CHECKOUT</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            {/* Order type */}
            <div className="flex gap-4">
              {(['delivery', 'pickup'] as const).map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                    orderType === type
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : 'border-white/15 text-white/60 hover:border-white/30'
                  }`}
                >
                  <input type="radio" value={type} {...register('orderType')} className="sr-only" />
                  <span className="capitalize font-semibold text-sm">{type}</span>
                </label>
              ))}
            </div>

            <Field label="Full Name" error={errors.customerName?.message} required>
              <input
                {...register('customerName')}
                placeholder="Your name"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
            </Field>

            <Field label="Phone Number" error={errors.phone?.message} required>
              <input
                {...register('phone')}
                placeholder="03XX-XXXXXXX"
                type="tel"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
            </Field>

            {orderType === 'delivery' && (
              <>
                <Field label="Delivery Address" error={errors.address?.message} required>
                  <textarea
                    {...register('address')}
                    placeholder="Full delivery address with house/flat number and street"
                    rows={3}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
                  />
                </Field>
                <Field label="Nearby Landmark" error={errors.landmark?.message}>
                  <input
                    {...register('landmark')}
                    placeholder="Mosque, school, shop near your address"
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </Field>
              </>
            )}

            <Field label="Special Instructions" error={errors.instructions?.message}>
              <textarea
                {...register('instructions')}
                placeholder="Extra spicy? No onions? Let us know…"
                rows={2}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
              />
            </Field>

            {submitError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                {submitError}
              </p>
            )}

            <Button type="submit" size="lg" loading={submitting} className="w-full">
              {submitting ? 'Placing Order…' : 'Place Order — Cash on Delivery'}
            </Button>

            <p className="text-white/30 text-xs text-center">
              Payment is cash on delivery. No card details required.
            </p>
          </form>

          {/* Order summary */}
          <div className="bg-[#111] border border-white/8 rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-white font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/60 truncate mr-2">
                    {item.name} {item.variantLabel && item.variantLabel !== 'Regular' ? `(${item.variantLabel})` : ''} ×{item.quantity}
                  </span>
                  <span className="text-white font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span><span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Delivery</span>
                <span className="text-yellow-400 text-xs">TBD by restaurant</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-1">
                <span>Min. Total</span><span>{formatPrice(sub)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
