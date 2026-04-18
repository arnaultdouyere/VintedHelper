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

  decodedFolders.sort((a,b) => a.name.localeCompare(b.name))

  const annoncesFolders = decodedFolders.filter(f => f.type === 'annonce')
  const etudesFolders = decodedFolders.filter(f => f.type === 'etude')

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="flex px-3 mb-3 gap-1">
        <button
          onClick={() => setActiveTab('annonce')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'annonce'
              ? 'bg-[#00D4C8]/10 text-[#00D4C8] border border-[#00D4C8]/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
          }`}
        >
          Annonces
        </button>
        <button
          onClick={() => setActiveTab('etude')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'etude'
              ? 'bg-[#00D4C8]/10 text-[#00D4C8] border border-[#00D4C8]/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
          }`}
        >
          Études
        </button>
      </div>

      {/* Generate AI button — only on annonces tab */}
      {activeTab === 'annonce' && (
        <div className="px-3 mb-3">
          <Link
            href="/dashboard/generate"
            className="flex items-center justify-center gap-2 w-full bg-[#00D4C8]/10 hover:bg-[#00D4C8]/20 text-[#00D4C8] border border-[#00D4C8]/20 font-medium py-2 rounded-xl transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Générer IA
          </Link>
        </div>
      )}

      {/* Tree */}
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
