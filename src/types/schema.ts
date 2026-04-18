export interface Folder {
  id: string
  user_id?: string
  name: string
  parent_id: string | null
  type?: 'annonce' | 'etude'
  created_at?: string
}

export interface ProductPage {
  id: string
  user_id?: string
  folder_id: string | null
  title: string | null
  description: string | null
  price: number | null
  hashtags: string | null
  notes: string | null
  status: 'draft' | 'ready' | 'archived'
  created_at?: string
}

export interface MarketResearchPage {
  id: string
  user_id?: string
  folder_id: string | null
  title: string
  description: string | null
  price_min: number | null
  price_max: number | null
  source_url: string | null
  created_at?: string
}

export interface ImageRecord {
  id: string
  user_id?: string
  page_id: string
  type: 'product' | 'research'
  url: string
  created_at?: string
}
