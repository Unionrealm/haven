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
          'bg-[#2A1E8A] text-[#C4B5FD]': variant === 'default',
          'bg-[#161616] text-[#888888] border border-[#1e1e1e]': variant === 'secondary',
          'bg-[#0d2818] text-green-400 border border-green-900': variant === 'success',
          'bg-[#2a1f00] text-yellow-400 border border-yellow-900': variant === 'warning',
          'bg-[#2a0d0d] text-red-400 border border-red-900': variant === 'destructive',
          'border border-[#1e1e1e] text-[#888888] bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
