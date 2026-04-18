import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FileText, BarChart2 } from 'lucide-react'
import { createProductPage } from '@/app/dashboard/products/actions'
import { createMarketResearchPage } from '@/app/dashboard/market-research/actions'
import { redirect } from 'next/navigation'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: folder } = await supabase
    .from('folders')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!folder) {
    return <div className="p-12 text-slate-500">Dossier introuvable.</div>
  }

  const folderType = folder.name.startsWith('[e]') ? 'etude' : 'annonce'
  const displayName = folder.name.startsWith('[a]') || folder.name.startsWith('[e]') ? folder.name.substring(3) : folder.name

  let items: any[] = []
  
  if (folderType === 'annonce') {
    const { data } = await supabase
      .from('product_pages')
      .select('*')
      .eq('folder_id', resolvedParams.id)
      .order('created_at', { ascending: false })
    if (data) items = data
  } else {
    const { data } = await supabase
      .from('market_research_pages')
      .select('*')
      .eq('folder_id', resolvedParams.id)
      .order('created_at', { ascending: false })
    if (data) items = data
  }

  const isAnnonce = folderType === 'annonce'

  return (
    <div className="flex flex-col h-full bg-[#0A0F1E] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06] bg-[#080D1A] sticky top-0 z-10">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">
            {isAnnonce ? 'Annonces' : 'Études de marché'}
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{displayName}</h1>
        </div>
        <div>
          {isAnnonce ? (
            <form action={async () => {
              'use server'
              const page = await createProductPage(resolvedParams.id)
              redirect(`/dashboard/products/${page.id}`)
            }}>
              <Button type="submit" className="bg-[#00D4C8] hover:bg-[#00A89E] text-[#0A0F1E] font-semibold rounded-xl px-5">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Annonce
              </Button>
            </form>
          ) : (
            <form action={async () => {
              'use server'
              const research = await createMarketResearchPage(resolvedParams.id)
              redirect(`/dashboard/market-research/${research.id}`)
            }}>
              <Button type="submit" className="bg-[#00D4C8]/10 hover:bg-[#00D4C8]/20 text-[#00D4C8] border border-[#00D4C8]/20 font-semibold rounded-xl px-5">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Étude
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
              {isAnnonce ? <FileText className="w-6 h-6 text-slate-500" /> : <BarChart2 className="w-6 h-6 text-slate-500" />}
            </div>
            <p className="font-semibold text-slate-300 mb-1">Ce dossier est vide</p>
            <p className="text-sm text-slate-600">Cliquez sur le bouton en haut à droite pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <Link
                key={item.id}
                href={isAnnonce ? `/dashboard/products/${item.id}` : `/dashboard/market-research/${item.id}`}
                className="block group"
              >
                <div className="p-5 border border-white/[0.06] rounded-2xl bg-[#0F1629] hover:border-[#00D4C8]/30 hover:bg-[#00D4C8]/[0.03] transition-all duration-200 flex flex-col h-full relative overflow-hidden cursor-pointer">
                  {/* Teal top bar on hover */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00D4C8] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-[#00D4C8]/20 group-hover:bg-[#00D4C8]/10 transition-colors shrink-0">
                      {isAnnonce
                        ? <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#00D4C8] transition-colors" />
                        : <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-[#00D4C8] transition-colors" />
                      }
                    </div>
                    <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2 pt-0.5 text-sm">
                      {item.title || 'Sans titre'}
                    </h3>
                  </div>
                  
                  {isAnnonce && (
                    <>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                        {item.description || 'Aucune description.'}
                      </p>
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/[0.04]">
                        <span className="text-base font-bold text-white">
                          {item.price ? `${item.price} €` : '—'}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          item.status === 'ready' 
                            ? 'bg-[#00D4C8]/10 text-[#00D4C8] border border-[#00D4C8]/20'
                            : item.status === 'archived'
                            ? 'bg-white/[0.04] text-slate-600 border border-white/[0.04]'
                            : 'bg-white/[0.04] text-slate-500 border border-white/[0.04]'
                        }`}>
                          {item.status === 'draft' ? 'Brouillon' : item.status === 'ready' ? 'Prêt' : 'Archivé'}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {!isAnnonce && (
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/[0.04]">
                      <span className="flex flex-col">
                        <span className="text-xs text-slate-600 uppercase tracking-wide">Min</span>
                        <span className="text-sm font-semibold text-slate-300">{item.price_min ? `${item.price_min} €` : '—'}</span>
                      </span>
                      <span className="flex flex-col text-right">
                        <span className="text-xs text-slate-600 uppercase tracking-wide">Max</span>
                        <span className="text-sm font-semibold text-[#00D4C8]">{item.price_max ? `${item.price_max} €` : '—'}</span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
