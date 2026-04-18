import { createClient } from '@/lib/supabase/server'
import ProductForm from '../components/ProductForm'
import { redirect } from 'next/navigation'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('product_pages')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !page) {
    return <div className="p-8 text-slate-500">Annonce introuvable.</div>
  }

  return <ProductForm initialData={page} />
}
