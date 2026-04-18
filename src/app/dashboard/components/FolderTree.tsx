'use client'

import React, { useState, useMemo } from 'react'
import { Folder } from '@/types/schema'
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen, Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createFolder, renameFolder, deleteFolder } from '@/app/dashboard/folders/actions'
import { toast } from 'sonner'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type FolderNode = Folder & { children: FolderNode[] }

function buildTree(folders: Folder[]): FolderNode[] {
  const map = new Map<string, FolderNode>()
  const roots: FolderNode[] = []

  folders.forEach(f => map.set(f.id, { ...f, children: [] }))

  folders.forEach(f => {
    if (f.parent_id && map.has(f.parent_id)) {
      map.get(f.parent_id)!.children.push(map.get(f.id)!)
    } else {
      roots.push(map.get(f.id)!)
    }
  })

  const sortNodes = (nodes: FolderNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach(n => sortNodes(n.children))
  }
  sortNodes(roots)
  return roots
}

interface TreeProps {
  initialFolders: Folder[]
  folderType: 'annonce' | 'etude'
}

export default function FolderTree({ initialFolders, folderType }: TreeProps) {
  const router = useRouter()
  const tree = useMemo(() => buildTree(initialFolders), [initialFolders])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'create-sub' | 'rename' | null>(null)
  const [targetFolder, setTargetFolder] = useState<Folder | null>(null)
  const [folderNameInput, setFolderNameInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAction = async () => {
    if (!folderNameInput.trim()) return
    setIsSubmitting(true)
    
    try {
      if (dialogMode === 'create') {
        const res = await createFolder(folderNameInput, folderType, null)
        if (res.error) throw new Error(res.error)
        toast.success("Dossier créé")
      } else if (dialogMode === 'create-sub' && targetFolder) {
        const res = await createFolder(folderNameInput, folderType, targetFolder.id)
        if (res.error) throw new Error(res.error)
        toast.success("Sous-dossier créé")
        setExpanded(prev => new Set(prev).add(targetFolder.id))
      } else if (dialogMode === 'rename' && targetFolder) {
        const res = await renameFolder(targetFolder.id, folderNameInput, folderType)
        if (res.error) throw new Error(res.error)
        toast.success("Dossier renommé")
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSubmitting(false)
      setDialogOpen(false)
      setFolderNameInput('')
      setTargetFolder(null)
      router.refresh()
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${name}" et tout son contenu ?`)) return
    const res = await deleteFolder(id)
    if (res.error) toast.error(res.error)
    else {
        toast.success("Dossier supprimé")
        router.refresh()
    }
  }

  const openDialog = (mode: 'create' | 'create-sub' | 'rename', folder?: FolderNode) => {
    setDialogMode(mode)
    setTargetFolder(folder || null)
    setFolderNameInput(mode === 'rename' && folder ? folder.name : '')
    setDialogOpen(true)
  }

  const renderNode = (node: FolderNode, level: number = 0) => {
    const isExpanded = expanded.has(node.id)
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center group rounded-md p-1.5 my-0.5 text-sm hover:bg-white/[0.04] cursor-pointer transition-colors`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <button 
            type="button"
            className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded"
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              toggleExpand(node.id)
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : <div className="w-4 h-4" />}
          </button>
          
          <Link href={`/dashboard/folders/${node.id}`} className="flex items-center flex-1 overflow-hidden" tabIndex={-1}>
             {isExpanded || !hasChildren ? <FolderOpen className="w-4 h-4 mr-2 text-[#00D4C8]" /> : <FolderIcon className="w-4 h-4 mr-2 text-[#00D4C8]/60" />}
             <span className="truncate text-slate-300 group-hover:text-white transition-colors">{node.name}</span>
          </Link>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex items-center pr-2">
             <DropdownMenu>
                <DropdownMenuTrigger className="h-6 w-6 p-0 text-slate-500 hover:text-[#00D4C8] hover:bg-white/[0.08] rounded flex items-center justify-center transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                   <DropdownMenuItem onClick={() => openDialog('create-sub', node)}>
                     <Plus className="mr-2 h-4 w-4" /> Ajouter un sous-dossier
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => openDialog('rename', node)}>
                     <Pencil className="mr-2 h-4 w-4" /> Renommer
                   </DropdownMenuItem>
                   <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(node.id, node.name)}>
                     <Trash className="mr-2 h-4 w-4 text-red-600" /> Supprimer
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="px-2 flex items-center justify-between mb-2">
         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossiers</span>
         <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-[#00D4C8] hover:bg-white/[0.06]" onClick={() => openDialog('create')}>
            <Plus className="w-4 h-4" />
         </Button>
      </div>

      <div className="w-full">
         {tree.length === 0 ? (
           <div className="px-4 py-8 text-center text-sm text-slate-600">
             Aucun dossier.
           </div>
         ) : (
           tree.map(root => renderNode(root, 0))
         )}
      </div>

      {/* Shared Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && "Nouveau dossier"}
              {dialogMode === 'create-sub' && "Nouveau sous-dossier"}
              {dialogMode === 'rename' && "Renommer le dossier"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
             <div className="text-sm text-slate-500">
                {dialogMode === 'create-sub' && `Dans : ${targetFolder?.name}`}
             </div>
             <Input 
                autoFocus
                placeholder="Nom du dossier"
                value={folderNameInput}
                onChange={e => setFolderNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAction() }}
             />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAction} disabled={isSubmitting || !folderNameInput.trim()}>
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
