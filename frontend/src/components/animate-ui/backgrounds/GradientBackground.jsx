import { motion } from 'motion/react'

/**
 * Subtle animated gradient orbs for hero sections.
 * Set opacity low (0.3–0.4) — this is decorative only.
 */
export function GradientBackground({ className = '', opacity = 0.35 }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
      }}
    >
      {/* Top-right indigo orb */}
      <motion.div
        animate={{
          x: [0, 15, -10, 0],
          y: [0, -10, 8, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '55%',
          paddingTop: '55%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Bottom-left green orb */}
      <motion.div
        animate={{
          x: [0, -12, 8, 0],
          y: [0, 12, -8, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '45%',
          paddingTop: '45%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-success-light) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />
    </div>
  )
}
