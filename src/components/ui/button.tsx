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
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)]',
          'disabled:opacity-40 disabled:cursor-not-allowed select-none',
          {
            /* Primary — the ONE place accent bg is used */
            'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]':
              variant === 'default',
            /* Secondary — neutral surface */
            'bg-[var(--bg-3)] text-[var(--text-2)] hover:bg-[var(--bg-4)] hover:text-[var(--text-1)] border border-[var(--border-1)]':
              variant === 'secondary',
            /* Outline — just a border */
            'border border-[var(--border-2)] bg-transparent text-[var(--text-1)] hover:bg-[var(--bg-3)]':
              variant === 'outline',
            /* Ghost — accent border, no fill */
            'border border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent-subtle)]':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600':
              variant === 'destructive',
            'bg-transparent underline-offset-4 hover:underline p-0 h-auto text-[var(--text-2)] hover:text-[var(--text-1)]':
              variant === 'link',
          },
          {
            'h-9 px-3.5 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-sm': size === 'lg',
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
