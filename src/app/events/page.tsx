'use client'

import { useState } from 'react'
import { EventCard } from '@/components/events/event-card'
import { mockEvents } from '@/lib/mock-data'
import { CATEGORIES, LOCATIONS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')

  const filtered = mockEvents.filter((event) => {
    if (event.status !== 'published') return false
    if (
      search &&
      !event.title.toLowerCase().includes(search.toLowerCase()) &&
      !event.venue.toLowerCase().includes(search.toLowerCase())
    )
      return false
    if (selectedCategory && event.category !== selectedCategory) return false
    if (selectedLocation && event.location !== selectedLocation) return false
    return true
  })

  const hasFilters = selectedCategory || selectedLocation || search

  const clearAll = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedLocation('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-1)] mb-1 tracking-tight">이벤트 탐색</h1>
        <p className="text-sm text-[var(--text-2)]">서울의 모든 인디 이벤트를 한눈에</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-3)] pointer-events-none" />
        <input
          type="text"
          placeholder="이벤트 이름, 장소 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--border-1)] bg-[var(--bg-2)] text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Category chips — active: accent-subtle bg + accent text, inactive: bg-3 + text-2 */}
      <div className="mb-3">
        <p className="text-[10px] font-medium text-[var(--text-3)] uppercase tracking-widest mb-2.5">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(active ? '' : cat)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-xs font-medium transition-colors',
                  active
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'bg-[var(--bg-3)] text-[var(--text-2)] hover:text-[var(--text-1)]'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location chips */}
      <div className="mb-8">
        <p className="text-[10px] font-medium text-[var(--text-3)] uppercase tracking-widest mb-2.5">지역</p>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.slice(0, 7).map((loc) => {
            const active = selectedLocation === loc
            return (
              <button
                key={loc}
                onClick={() => setSelectedLocation(active ? '' : loc)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-xs font-medium transition-colors',
                  active
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'bg-[var(--bg-3)] text-[var(--text-2)] hover:text-[var(--text-1)]'
                )}
              >
                {loc}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-[var(--text-3)]">{filtered.length}개의 이벤트</p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            필터 초기화
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-[var(--text-3)]" />
          </div>
          <p className="font-semibold text-[var(--text-1)] mb-1">검색 결과가 없습니다</p>
          <p className="text-sm text-[var(--text-2)] mb-5">다른 키워드나 필터를 사용해보세요</p>
          <Button variant="outline" size="sm" onClick={clearAll}>
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
