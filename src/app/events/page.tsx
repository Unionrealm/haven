'use client'

import { useState } from 'react'
import { EventCard } from '@/components/events/event-card'
import { mockEvents } from '@/lib/mock-data'
import { CATEGORIES, LOCATIONS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')

  const filtered = mockEvents.filter((event) => {
    if (event.status !== 'published') return false
    if (search && !event.title.toLowerCase().includes(search.toLowerCase()) &&
        !event.venue.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCategory && event.category !== selectedCategory) return false
    if (selectedLocation && event.location !== selectedLocation) return false
    return true
  })

  const hasFilters = selectedCategory || selectedLocation || search

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 tracking-tight">이벤트 탐색</h1>
        <p className="text-sm text-[var(--muted-foreground)]">서울의 모든 인디 이벤트를 한눈에</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="이벤트 이름, 장소 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--border)] bg-transparent text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>필터:</span>
          </div>

          {/* Category filters */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="w-px h-6 bg-[var(--border)] self-center mx-1" />

          {/* Location filters */}
          {LOCATIONS.slice(0, 6).map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedLocation === loc
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
              }`}
            >
              {loc}
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedLocation('') }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <X className="h-3 w-3" />
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-[var(--muted-foreground)] mb-5">
        {filtered.length}개의 이벤트
      </p>

      {/* Event grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-medium mb-1">검색 결과가 없습니다</p>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            다른 키워드나 필터를 사용해보세요
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedLocation('') }}>
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
