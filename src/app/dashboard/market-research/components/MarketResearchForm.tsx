'use client'

import { useState, useCallback, useEffect } from 'react'
import { MarketResearchPage, ImageRecord } from '@/types/schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateMarketResearchPage, deleteMarketResearchPage, saveImageRecord } from '@/app/dashboard/market-research/actions'
import { toast } from 'sonner'
import { Trash2, ArrowLeft, Save, Copy, Loader2, ImagePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function MarketResearchForm({ 
  initialData, 
  initialImages 
}: { 
  initialData: MarketResearchPage
  initialImages: ImageRecord[] 
}) {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<MarketResearchPage>(initialData)
  const [images, setImages] = useState<ImageRecord[]>(initialImages)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateMarketResearchPage(data.id, {
         title: data.title,
         description: data.description,
         price_min: data.price_min,
         price_max: data.price_max,
         source_url: data.source_url
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
    if (!confirm("Voulez-vous vraiment supprimer cette étude ?")) return
    try {
      await deleteMarketResearchPage(data.id, data.folder_id!)
      toast.success("Étude supprimée")
      router.push(`/dashboard/folders/${data.folder_id}`)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return toast.error('Seules les images sont acceptées')
    setIsUploading(true)
    try {
       const fileExt = file.name.split('.').pop()
       const filePath = `${data.user_id}/${data.id}/${Math.random()}.${fileExt}`
       
       const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, file)
          
       if (uploadError) throw new Error(uploadError.message)
       
       const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(filePath)
       const newImage = await saveImageRecord(data.id, publicUrlData.publicUrl, 'research')
       setImages(prev => [...prev, newImage as ImageRecord])
       toast.success('Image ajoutée')
    } catch(e: any) {
       toast.error(`Erreur d'upload: ${e.message}`)
    } finally {
       setIsUploading(false)
    }
  }

  // Handle Ctrl+V paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
       const items = e.clipboardData?.items
       if (!items) return
       for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
             const blob = items[i].getAsFile()
             if (blob) handleUploadFile(blob)
          }
       }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [data.id, data.user_id, supabase])

  const copyUrl = (url: string) => {
     navigator.clipboard.writeText(url)
     toast("Lien copié dans le presse-papier !")
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 shrink-0 sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/folders/${data.folder_id}`)}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 border-none bg-transparent focus:outline-none placeholder-slate-400">
             Étude de marché
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Enregistrement..." : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>}
          </Button>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
             <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
         
         {/* Left Side: Images Carousel / Gallery */}
         <div className="md:w-1/2 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 min-h-[300px] flex flex-col items-center justify-center text-center">
               {isUploading ? (
                  <div className="flex flex-col items-center text-blue-600">
                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     <span>Upload en cours...</span>
                  </div>
               ) : (
                  <div className="text-slate-500">
                     <ImagePlus className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                     <p className="font-semibold text-slate-700">Collez une image (Ctrl+V)</p>
                     <p className="text-sm">pour l'ajouter à la galerie</p>
                  </div>
               )}
            </div>

            {images.length > 0 && (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map(img => (
                     <div key={img.id} className="relative group rounded-lg overflow-hidden border bg-white aspect-square flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Reference" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button size="sm" variant="secondary" onClick={() => copyUrl(img.url)}>
                              <Copy className="w-4 h-4 mr-2" /> Copier lien
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Right Side: Form */}
         <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-xl border shadow-sm grid gap-6">
               <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-600">Titre de l'étude *</Label>
                  <Input 
                    id="title"
                    className="text-lg py-6"
                    placeholder="ex: Manteaux Zara Hiver 2023"
                    value={data.title}
                    onChange={e => setData({...data, title: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label htmlFor="price_min" className="text-slate-600">Prix Min (€)</Label>
                     <Input 
                       id="price_min"
                       type="number"
                       step="0.01"
                       value={data.price_min || ''}
                       onChange={e => setData({...data, price_min: parseFloat(e.target.value)})}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="price_max" className="text-slate-600">Prix Max (€)</Label>
                     <Input 
                       id="price_max"
                       type="number"
                       step="0.01"
                       value={data.price_max || ''}
                       onChange={e => setData({...data, price_max: parseFloat(e.target.value)})}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="source" className="text-slate-600">Lien Source (URL Vinted, etc)</Label>
                  <Input 
                    id="source"
                    placeholder="https://vinted.fr/..."
                    value={data.source_url || ''}
                    onChange={e => setData({...data, source_url: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-600">Notes / Analyse</Label>
                  <Textarea 
                    id="description"
                    className="min-h-[200px]"
                    placeholder="Observations sur le marché, la concurrence..."
                    value={data.description || ''}
                    onChange={e => setData({...data, description: e.target.value})}
                  />
               </div>
            </div>
         </div>
         
      </div>
    </div>
  )
}
