import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn('flex gap-1 flex-wrap', className)}
    {...props}
  />
)

const TabsTrigger = ({ className, value, children, ...props }) => {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn('tab-trigger', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />
)

export { Tabs, TabsList, TabsTrigger, TabsContent }
