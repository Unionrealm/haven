export type UserRole = 'organizer' | 'attendee'
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled'
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type EventCategory =
  | '공연/콘서트'
  | '네트워킹'
  | '원데이클래스'
  | '파티'
  | '기타'

export type SeoulDistrict =
  | '홍대'
  | '이태원'
  | '성수'
  | '대학로'
  | '강남'
  | '신촌'
  | '합정'
  | '을지로'
  | '종로'
  | '기타'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Event {
  id: string
  organizer_id: string
  title: string
  description: string
  cover_image?: string
  date: string
  end_date?: string
  venue: string
  address: string
  location: SeoulDistrict
  category: EventCategory
  status: EventStatus
  slug: string
  map_url?: string
  organizer?: User
  ticket_types?: TicketType[]
  created_at: string
  updated_at: string
}

export interface TicketType {
  id: string
  event_id: string
  name: string
  description?: string
  price: number
  quantity: number
  quantity_sold: number
  created_at: string
}

export interface Ticket {
  id: string
  event_id: string
  ticket_type_id: string
  attendee_name: string
  attendee_phone: string
  attendee_email?: string
  payment_status: PaymentStatus
  qr_code: string
  checked_in: boolean
  checked_in_at?: string
  purchase_price: number
  created_at: string
  event?: Event
  ticket_type?: TicketType
}

export interface Payout {
  id: string
  event_id: string
  amount: number
  fee: number
  net_amount: number
  status: PayoutStatus
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      ticket_types: {
        Row: TicketType
        Insert: Omit<TicketType, 'id' | 'created_at' | 'quantity_sold'>
        Update: Partial<Omit<TicketType, 'id' | 'created_at'>>
      }
      tickets: {
        Row: Ticket
        Insert: Omit<Ticket, 'id' | 'created_at'>
        Update: Partial<Omit<Ticket, 'id' | 'created_at'>>
      }
      payouts: {
        Row: Payout
        Insert: Omit<Payout, 'id' | 'created_at'>
        Update: Partial<Omit<Payout, 'id' | 'created_at'>>
      }
    }
  }
}
