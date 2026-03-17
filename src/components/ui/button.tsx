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
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A42F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:opacity-40 disabled:cursor-not-allowed select-none',
          {
            'bg-[#5A42F5] text-white hover:bg-[#6B55F7] active:bg-[#3D2DB8]':
              variant === 'default',
            'bg-[#161616] text-[#888888] hover:bg-[#1e1e1e] hover:text-white border border-[#1e1e1e]':
              variant === 'secondary',
            'border border-[#1e1e1e] bg-transparent text-white hover:bg-[#161616] hover:border-[#333]':
              variant === 'outline',
            'border border-[#5A42F5] text-[#5A42F5] bg-transparent hover:bg-[#110D2E]':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600':
              variant === 'destructive',
            'bg-transparent underline-offset-4 hover:underline p-0 h-auto text-[#888888] hover:text-white':
              variant === 'link',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
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
