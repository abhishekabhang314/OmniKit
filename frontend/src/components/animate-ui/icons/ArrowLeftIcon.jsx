import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'

export function ArrowLeftIcon({ size = 14, ...props }) {
  return (
    <motion.span
      whileHover={{ x: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <ArrowLeft size={size} {...props} />
    </motion.span>
  )
}
