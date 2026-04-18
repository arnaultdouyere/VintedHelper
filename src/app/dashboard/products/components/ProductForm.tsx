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

  const statusColors: Record<string, string> = {
    draft: 'text-slate-400',
    ready: 'text-[#00D4C8]',
    archived: 'text-slate-600'
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0F1E]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0 sticky top-0 bg-[#080D1A] z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/folders/${data.folder_id}`)} className="text-slate-400 hover:text-white hover:bg-white/[0.06]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Annonce</p>
            <h1 className="text-base font-semibold text-white leading-tight truncate max-w-xs">{data.title || 'Sans titre'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={simulateAi} className="text-[#00D4C8] border border-[#00D4C8]/20 hover:bg-[#00D4C8]/10 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Générer avec l'IA
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#00D4C8] hover:bg-[#00A89E] text-[#0A0F1E] font-semibold">
            {isSaving ? "Enregistrement..." : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>}
          </Button>
          <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">

          <div className="space-y-2">
            <Label className="text-xs text-slate-400 uppercase tracking-wide">Titre de l'annonce</Label>
            <Input
              className="bg-[#0F1629] border-white/[0.08] text-white placeholder:text-slate-600 text-lg py-6 focus:border-[#00D4C8]/50 focus:ring-[#00D4C8]/20"
              placeholder="ex: Manteau d'hiver Zara Noir taille M"
              value={data.title || ''}
              onChange={e => setData({...data, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400 uppercase tracking-wide">Prix (€)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-[#0F1629] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#00D4C8]/50"
                value={data.price || ''}
                onChange={e => setData({...data, price: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400 uppercase tracking-wide">Statut</Label>
              <select
                className="w-full rounded-lg border border-white/[0.08] bg-[#0F1629] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4C8]/50"
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
            <Label className="text-xs text-slate-400 uppercase tracking-wide">Description</Label>
            <Textarea
              className="bg-[#0F1629] border-white/[0.08] text-white placeholder:text-slate-600 min-h-[200px] resize-y focus:border-[#00D4C8]/50"
              placeholder="Décrivez votre article (matière, état, coupe...)"
              value={data.description || ''}
              onChange={e => setData({...data, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-400 uppercase tracking-wide">Hashtags Vinted</Label>
            <Textarea
              rows={2}
              className="bg-[#0F1629] border-white/[0.08] text-[#00D4C8] placeholder:text-slate-600 focus:border-[#00D4C8]/50"
              placeholder="#zara #manteau #hiver"
              value={data.hashtags || ''}
              onChange={e => setData({...data, hashtags: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-400 uppercase tracking-wide">Notes personnelles <span className="normal-case text-slate-600">(non publiées)</span></Label>
            <Textarea
              rows={3}
              className="bg-[#0F1629] border-yellow-900/30 text-slate-300 placeholder:text-slate-600 focus:border-yellow-700/50"
              placeholder="Informations sur l'achat, marge visée, défauts cachés..."
              value={data.notes || ''}
              onChange={e => setData({...data, notes: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
