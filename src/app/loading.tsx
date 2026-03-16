export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" />
      </div>
    </div>
  )
}
