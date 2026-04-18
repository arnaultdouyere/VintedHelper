import { getFolders } from '@/app/dashboard/folders/actions'
import FolderTabs from './FolderTabs'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function Sidebar() {
  const supabase = await createClient()
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .order('name', { ascending: true })

  return (
    <aside className="w-72 border-r bg-slate-50/50 backdrop-blur-xl h-screen flex flex-col py-6">
      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 shadow-md flex items-center justify-center text-white font-black text-sm tracking-tighter">
          VH
        </div>
        <span className="font-extrabold text-lg tracking-tight text-slate-800">VintedHelper</span>
      </div>
      
      <div className="flex-1 w-full flex flex-col min-h-0">
         <FolderTabs allFolders={folders || []} />
      </div>

      <div className="mt-auto px-6 w-full pt-6">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 font-medium transition-colors">
            Déconnexion
          </Button>
        </form>
      </div>
    </aside>
  )
}
