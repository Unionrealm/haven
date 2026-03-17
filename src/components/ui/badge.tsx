import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          /* Haven badge: accent-subtle bg, accent text */
          'bg-[var(--accent-subtle)] text-[var(--accent)]': variant === 'default',
          /* Neutral */
          'bg-[var(--bg-3)] text-[var(--text-3)] border border-[var(--border-1)]': variant === 'secondary',
          'bg-[var(--bg-3)] text-green-500 border border-[var(--border-1)]': variant === 'success',
          'bg-[var(--bg-3)] text-yellow-500 border border-[var(--border-1)]': variant === 'warning',
          'bg-[var(--bg-3)] text-red-500 border border-[var(--border-1)]': variant === 'destructive',
          'border border-[var(--border-2)] text-[var(--text-2)] bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
