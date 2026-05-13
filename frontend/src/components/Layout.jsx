import React from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <main style={{
        flex: 1,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        padding: 'var(--space-8) var(--space-6)',
        position: 'relative',
        zIndex: 1,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <React.Suspense fallback={<div className="p-12 text-center text-[var(--color-text-muted)]">Loading...</div>}>
              <Outlet />
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}