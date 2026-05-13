import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const Accordion = AccordionPrimitive.Root

const AccordionItem = ({ className, ...props }) => (
  <AccordionPrimitive.Item
    className={cn('border-b border-[var(--color-border)]', className)}
    {...props}
  />
)

const AccordionTrigger = ({ className, children, ...props }) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        'flex flex-1 items-center justify-between py-3 text-sm font-medium',
        'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        'transition-colors cursor-pointer select-none',
        '[&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        size={16}
        style={{
          color: 'var(--color-text-muted)',
          transition: 'transform 0.25s ease',
          flexShrink: 0,
        }}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

const AccordionContent = ({ className, children, ...props }) => (
  <AccordionPrimitive.Content
    className={cn(
      'overflow-hidden text-sm',
      'data-[state=open]:animate-accordion-down',
      'data-[state=closed]:animate-accordion-up',
      className
    )}
    {...props}
  >
    <div className="pb-4">{children}</div>
  </AccordionPrimitive.Content>
)

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
