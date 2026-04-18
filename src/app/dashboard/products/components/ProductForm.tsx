'use client'

import { useState } from 'react'
import { ProductPage } from '@/types/schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateProductPage, deleteProductPage } from '@/app/dashboard/products/actions'
import { toast } from 'sonner'
import { Sparkles, Trash2, ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProductForm({ initialData }: { initialData: ProductPage }) {
  const router = useRouter()
  const [data, setData] = useState<ProductPage>(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProductPage(data.id, {
         title: data.title,
         description: data.description,
         price: data.price,
         hashtags: data.hashtags,
         notes: data.notes,
         status: data.status
      })
      toast.success("Modifications enregistrées")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return
    try {
      await deleteProductPage(data.id, data.folder_id!)
      toast.success("Annonce supprimée")
      router.push(`/dashboard/folders/${data.folder_id}`)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const simulateAi = () => {
    toast.info("La génération IA sera disponible dans une prochaine version !")
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/folders/${data.folder_id}`)}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 border-none bg-transparent focus:outline-none placeholder-slate-400">
             Édition de l'annonce
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={simulateAi}>
            <Sparkles className="w-4 h-4 mr-2" />
            Générer avec l'IA
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Enregistrement..." : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>}
          </Button>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
             <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Form */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
           
           <div className="grid gap-6">
              <div className="space-y-2">
                 <Label htmlFor="title" className="text-slate-600">Titre de l'annonce</Label>
                 <Input 
                   id="title"
                   className="text-lg py-6"
                   placeholder="ex: Manteau d'hiver Zara Noir taille M"
                   value={data.title || ''}
                   onChange={e => setData({...data, title: e.target.value})}
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-600">Prix (€)</Label>
                    <Input 
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={data.price || ''}
                      onChange={e => setData({...data, price: parseFloat(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-600">Statut</Label>
                    <select 
                       id="status" 
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                       value={data.status}
                       onChange={e => setData({...data, status: e.target.value as 'draft'|'ready'|'archived'})}
                    >
                       <option value="draft">Brouillon</option>
                       <option value="ready">Prêt à publier</option>
                       <option value="archived">Archivé</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="description" className="text-slate-600">Description</Label>
                 <Textarea 
                   id="description"
                   className="min-h-[200px] resize-y"
                   placeholder="Décrivez votre article (matière, état, coupe...)"
                   value={data.description || ''}
                   onChange={e => setData({...data, description: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="hashtags" className="text-slate-600">Hashtags Vinted</Label>
                 <Textarea 
                   id="hashtags"
                   rows={2}
                   placeholder="#zara #manteau #hiver"
                   value={data.hashtags || ''}
                   onChange={e => setData({...data, hashtags: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="notes" className="text-slate-600">Notes personnelles (non publiées)</Label>
                 <Textarea 
                   id="notes"
                   rows={3}
                   className="bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-500"
                   placeholder="Informations sur l'achat, marge visée, défauts cachés..."
                   value={data.notes || ''}
                   onChange={e => setData({...data, notes: e.target.value})}
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
