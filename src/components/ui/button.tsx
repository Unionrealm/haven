import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
          {
            'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98] focus-visible:ring-[var(--ring)]':
              variant === 'default',
            'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] focus-visible:ring-[var(--ring)]':
              variant === 'secondary',
            'border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] focus-visible:ring-[var(--ring)]':
              variant === 'outline',
            'bg-transparent hover:bg-[var(--accent)] focus-visible:ring-[var(--ring)]':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500':
              variant === 'destructive',
            'bg-transparent underline-offset-4 hover:underline p-0 h-auto':
              variant === 'link',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
