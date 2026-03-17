import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--text-1)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'flex h-11 w-full appearance-none rounded-lg border border-[var(--border-1)] bg-[var(--bg-2)] px-3 py-2 pr-8 text-sm text-[var(--text-1)]',
              'focus:outline-none focus:border-[var(--accent)] transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" style={{ background: 'var(--bg-2)' }}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-2)' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-3)] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-3)]">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export { Select }
