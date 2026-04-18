'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Sparkles, ImagePlus, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'


interface Folder {
  id: string;
  ui_name: string;
}

export default function GenerateForm({ folders, userId }: { folders: Folder[], userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [provider, setProvider] = useState('openai')
  const [folderId, setFolderId] = useState(folders[0]?.id || '')
  const [images, setImages] = useState<string[]>([])
  const [details, setDetails] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [showPromptOptions, setShowPromptOptions] = useState(false)

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return toast.error('Seules les images sont acceptées')
    setIsUploading(true)
    try {
       const fileExt = file.name.split('.').pop()
       const filePath = `temp_ai/${userId}/${Math.random()}.${fileExt}`
       
       const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file)
       if (uploadError) throw new Error(uploadError.message)
       
       const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(filePath)
       setImages(prev => [...prev, publicUrlData.publicUrl])
    } catch(e: any) {
       toast.error(`Erreur d'upload: ${e.message}`)
    } finally {
       setIsUploading(false)
    }
  }

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
  }, [userId])

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (images.length === 0) return toast.error("Veuillez ajouter au moins une image.")
    if (!folderId) return toast.error("Veuillez sélectionner un dossier de destination.")
    
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetFolderId: folderId,
          imageUrls: images,
          details,
          customPrompt,
          provider
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur de génération")
      
      toast.success("Annonce générée avec succès !")
      router.push(`/dashboard/products/${data.pageId}`)
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl">
      
      {/* Left side: Images */}
      <div className="space-y-4">
         <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-200 min-h-[300px] flex flex-col items-center justify-center text-center relative border-dashed">
            {isUploading ? (
               <div className="flex flex-col items-center text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span>Upload en cours...</span>
               </div>
            ) : (
               <div className="text-slate-500">
                  <ImagePlus className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-semibold text-slate-700">Collez une image (Ctrl+V)</p>
                  <p className="text-sm">Glissez-déposez n'est pas encore actif, utilisez Ctrl+V</p>
               </div>
            )}
         </div>

         {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
               {images.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border bg-white aspect-square flex items-center justify-center">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={url} alt="Reference" className="object-cover w-full h-full" />
                     <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Right side: Options */}
      <div className="space-y-6">
         <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                  <Label className="text-slate-600 font-medium text-xs uppercase tracking-wide">Modèle IA</Label>
                  <select
                     className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                     value={provider}
                     onChange={e => setProvider(e.target.value)}
                  >
                     <option value="openai">GPT-4o</option>
                     <option value="google">Gemini 1.5 Pro</option>
                     <option value="anthropic">Claude 3.5 Sonnet</option>
                  </select>
               </div>
               
               <div className="flex flex-col gap-2">
                  <Label className="text-slate-600 font-medium text-xs uppercase tracking-wide">Dossier de destination</Label>
                  <select
                     className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                     value={folderId}
                     onChange={e => setFolderId(e.target.value)}
                  >
                     {folders.length === 0 && <option value="" disabled>Aucun dossier Annonce disponible</option>}
                     {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.ui_name}</option>
                     ))}
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <Label>Détails supplémentaires (Matière, défauts, taille exacte...)</Label>
               <Textarea 
                  placeholder="Ex: Le manteau a une petite rayure sur le bouton droit. Taille M mais taille grand."
                  className="min-h-[120px]"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
               />
            </div>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
               <button 
                  onClick={() => setShowPromptOptions(!showPromptOptions)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
               >
                  <span>Personnaliser le Prompt de l'IA (Avancé)</span>
                  {showPromptOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
               </button>
               {showPromptOptions && (
                  <div className="p-4 bg-white border-t border-slate-200">
                     <Textarea 
                        placeholder="Laissez vide pour utiliser le prompt natif."
                        className="min-h-[150px] text-xs font-mono bg-slate-50"
                        value={customPrompt}
                        onChange={e => setCustomPrompt(e.target.value)}
                     />
                     <p className="text-xs text-slate-500 mt-2">
                        Attention : L'IA doit obligatoirement renvoyer un JSON contenant `title`, `description` et `hashtags`.
                     </p>
                  </div>
               )}
            </div>

            <Button 
               disabled={isGenerating || images.length === 0 || !folderId} 
               onClick={handleGenerate}
               className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-base font-semibold shadow-md rounded-xl"
            >
               {isGenerating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyse des photos et Génération...</>
               ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Générer l'Annonce Vinted</>
               )}
            </Button>
         </div>
      </div>
      
    </div>
  )
}
