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

  return (
    <div className="p-10 flex flex-col h-full bg-slate-50/50 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {displayName}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
             Type : {folderType === 'annonce' ? "Annonces Vinted" : "Études de Marché"}
          </p>
        </div>
        <div>
          {folderType === 'annonce' ? (
             <form action={async () => {
                'use server'
                const page = await createProductPage(resolvedParams.id)
                redirect(`/dashboard/products/${page.id}`)
             }}>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-full px-6">
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
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-full px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Étude
                </Button>
             </form>
          )}
        </div>
      </div>

      <div className="space-y-8 mt-2">
         {items.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white/50">
               {folderType === 'annonce' ? <FileText className="w-8 h-8 mb-4 opacity-50" /> : <BarChart2 className="w-8 h-8 mb-4 opacity-50" />}
               <p className="font-medium text-slate-600">Ce dossier est vide.</p>
               <p className="text-sm">Cliquez sur le bouton en haut à droite pour commencer.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {items.map(item => (
                  <Link 
                     key={item.id} 
                     href={folderType === 'annonce' ? `/dashboard/products/${item.id}` : `/dashboard/market-research/${item.id}`} 
                     className="block group"
                  >
                     <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full relative cursor-pointer overflow-hidden">
                        
                        {/* Decorative Top Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${folderType === 'annonce' ? 'bg-slate-800' : 'bg-indigo-600'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="flex items-start gap-3 mb-4">
                           <div className={`p-2 rounded-xl ${folderType === 'annonce' ? 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'} transition-colors`}>
                              {folderType === 'annonce' ? <FileText className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                           </div>
                           <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors leading-tight line-clamp-2 pt-1">
                              {item.title || "Sans titre"}
                           </h3>
                        </div>
                        
                        {folderType === 'annonce' && (
                           <>
                              <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">
                                 {item.description || "Aucune description fournie."}
                              </p>
                              <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                                 <span className="text-lg font-bold text-slate-900">
                                    {item.price ? `${item.price} €` : '-'}
                                 </span>
                                 <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {item.status}
                                 </span>
                              </div>
                           </>
                        )}
                        
                        {folderType === 'etude' && (
                           <>
                              <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mt-auto pt-4 border-t border-slate-100">
                                 <span className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Prix Min</span>
                                    <span className="text-lg">{item.price_min ? `${item.price_min} €` : '-'}</span>
                                 </span>
                                 <span className="flex flex-col text-right">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Prix Max</span>
                                    <span className="text-lg text-indigo-600">{item.price_max ? `${item.price_max} €` : '-'}</span>
                                 </span>
                              </div>
                           </>
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
