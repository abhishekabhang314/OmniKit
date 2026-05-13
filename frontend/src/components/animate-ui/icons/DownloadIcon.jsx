import { motion } from 'motion/react'
import { Download } from 'lucide-react'

export function DownloadIcon({ size = 16, ...props }) {
  return (
    <motion.span
      whileTap={{ y: 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Download size={size} {...props} />
    </motion.span>
  )
}
