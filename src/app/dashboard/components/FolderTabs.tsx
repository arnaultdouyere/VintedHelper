'use client'

import { useState } from 'react'
import { Folder } from '@/types/schema'
import FolderTree from './FolderTree'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function FolderTabs({ allFolders }: { allFolders: Folder[] }) {
  const [activeTab, setActiveTab] = useState<'annonce' | 'etude'>('annonce')

  const decodedFolders = allFolders.map(f => {
    let type: 'annonce'|'etude' = 'annonce';
    let uiName = f.name;
    if (f.name.startsWith('[e]')) {
      type = 'etude';
      uiName = f.name.substring(3);
    } else if (f.name.startsWith('[a]')) {
      type = 'annonce';
      uiName = f.name.substring(3);
    }
    return { ...f, type, name: uiName };
  })

  // Sort them so the tree displays alphabetically
  decodedFolders.sort((a,b) => a.name.localeCompare(b.name))

  const annoncesFolders = decodedFolders.filter(f => f.type === 'annonce')
  const etudesFolders = decodedFolders.filter(f => f.type === 'etude')

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex p-2 bg-slate-100 rounded-lg mx-4 mb-4 gap-1">
        <button
          onClick={() => setActiveTab('annonce')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'annonce' 
              ? 'bg-white shadow-sm text-slate-800' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Annonces
        </button>
        <button
          onClick={() => setActiveTab('etude')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'etude' 
              ? 'bg-white shadow-sm text-slate-800' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Études
        </button>
      </div>

      {activeTab === 'annonce' && (
        <div className="px-4 mb-4">
          <Link href="/dashboard/generate" className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm border border-slate-700">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Générer IA
          </Link>
        </div>
      )}

      <div className="flex-1 w-full overflow-y-auto px-2">
         {activeTab === 'annonce' ? (
           <FolderTree initialFolders={annoncesFolders} folderType="annonce" />
         ) : (
           <FolderTree initialFolders={etudesFolders} folderType="etude" />
         )}
      </div>
    </div>
  )
}
