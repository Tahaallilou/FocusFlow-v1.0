import * as React from 'react'
import { cn } from '@/utils/cn'

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-primary/10 text-primary border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    destructive: 'bg-danger/10 text-danger border-transparent',
    success: 'bg-success/10 text-success border-transparent',
    warning: 'bg-warning/10 text-warning border-transparent',
    outline: 'border-border text-muted-foreground bg-transparent',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium leading-tight transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
