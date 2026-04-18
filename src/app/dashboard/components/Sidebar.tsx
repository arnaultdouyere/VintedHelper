import { createClient } from '@/lib/supabase/server'
import FolderTabs from './FolderTabs'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

export default async function Sidebar() {
  const supabase = await createClient()
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .order('name', { ascending: true })

  return (
    <aside className="w-64 border-r border-white/[0.06] bg-[#080D1A] h-screen flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
        <Image
          src="/logo.png"
          alt="VintedHelper Logo"
          width={32}
          height={32}
          className="rounded-lg shrink-0"
        />
        <span className="font-bold text-base tracking-tight text-white">VintedHelper</span>
      </Link>
      
      {/* Folder Navigation */}
      <div className="flex-1 w-full flex flex-col min-h-0 py-3">
        <FolderTabs allFolders={folders || []} />
      </div>

      {/* Logout */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        <form action={logout}>
          <Button
            variant="ghost"
            type="submit"
            className="w-full justify-start gap-2 text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] font-medium text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </form>
      </div>
    </aside>
  )
}
