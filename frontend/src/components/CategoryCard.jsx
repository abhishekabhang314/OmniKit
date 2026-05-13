import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { CategoryIcon } from './Icon'
import { Card, CardContent } from '@/components/ui/card'

export default function CategoryCard({ slug, label, count }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link to={`/${slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <Card className="h-full border-[1.5px] border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-primary)] transition-all bg-[var(--color-surface)] group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
              <CategoryIcon category={slug} size={22} />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[15px] text-[var(--color-text-primary)] leading-none mb-1.5">
                {label}
              </h3>
              <p className="font-sans text-[13px] text-[var(--color-text-muted)] leading-none m-0">
                {count} tool{count !== 1 && 's'}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
