import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, FolderOpen, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const username = user.email?.split('@')[0] ?? 'vous'

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="max-w-lg">
        {/* Glow */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#00D4C8]/10 border border-[#00D4C8]/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#00D4C8]" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Bienvenue, <span className="text-[#00D4C8]">{username}</span>
        </h1>
        <p className="text-slate-400 mb-10 leading-relaxed">
          Sélectionnez un dossier dans la barre latérale pour commencer,<br />
          ou choisissez une action ci-dessous.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard/generate" className="group p-5 rounded-2xl bg-[#0F1629] border border-white/[0.06] hover:border-[#00D4C8]/30 hover:bg-[#00D4C8]/5 transition-all text-left">
            <Sparkles className="w-6 h-6 text-[#00D4C8] mb-3" />
            <p className="font-semibold text-white text-sm mb-1">Générer IA</p>
            <p className="text-xs text-slate-500">Créer une annonce depuis vos photos</p>
          </Link>
          <div className="group p-5 rounded-2xl bg-[#0F1629] border border-white/[0.06] text-left opacity-60">
            <FolderOpen className="w-6 h-6 text-slate-400 mb-3" />
            <p className="font-semibold text-white text-sm mb-1">Ouvrir un dossier</p>
            <p className="text-xs text-slate-500">Via la barre de gauche</p>
          </div>
        </div>
      </div>
    </div>
  )
}
