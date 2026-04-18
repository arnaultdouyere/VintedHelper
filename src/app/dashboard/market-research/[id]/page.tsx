import { createClient } from '@/lib/supabase/server'
import MarketResearchForm from '../components/MarketResearchForm'

export default async function MarketResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('market_research_pages')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !page) {
    return <div className="p-8 text-slate-500">Étude introuvable.</div>
  }

  const { data: images } = await supabase
    .from('images')
    .select('*')
    .eq('page_id', resolvedParams.id)
    .order('created_at', { ascending: true })

  return <MarketResearchForm initialData={page} initialImages={images || []} />
}
