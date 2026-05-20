import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolIcon } from './Icon'

export default function ToolCard({ tool }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link to={tool.route} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        <Card className="h-full border-[1.5px] border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-primary)] transition-all bg-[var(--color-surface)]">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <ToolIcon id={tool.id} size={20} />
            </div>
            {tool.new && (
              <Badge variant="secondary" className="bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">
                New
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardTitle className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight mb-1">
              {tool.name}
            </CardTitle>
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
              {tool.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}