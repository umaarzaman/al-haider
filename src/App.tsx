import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { MenuPage } from '@/pages/MenuPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { TrackOrderPage } from '@/pages/TrackOrderPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0a0a0a] min-h-screen">{children}</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
        <Route path="/confirmation/:ref" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
        <Route path="/track" element={<PublicLayout><TrackOrderPage /></PublicLayout>} />
        <Route path="/track/:ref" element={<PublicLayout><TrackOrderPage /></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout><AdminLoginPage /></AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center text-center pt-20">
              <div>
                <p className="text-8xl mb-4">🍕</p>
                <h2 className="font-display text-5xl text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PAGE NOT FOUND</h2>
                <p className="text-white/50 mb-6">This page went out for delivery and never came back.</p>
                <a href="/" className="text-yellow-400 hover:underline">Go Home</a>
              </div>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}
