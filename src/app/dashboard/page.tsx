import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const username = user.email?.split('@')[0] ?? 'vous'

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="max-w-md">
        {/* Glow icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#00D4C8]/10 border border-[#00D4C8]/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#00D4C8]" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Bienvenue, <span className="text-[#00D4C8]">{username}</span>
        </h1>
        <p className="text-slate-400 mb-10 leading-relaxed">
          Sélectionnez un dossier dans la barre latérale pour commencer,<br />
          ou générez une annonce directement depuis vos photos.
        </p>

        <Link
          href="/dashboard/generate"
          className="inline-flex items-center gap-2 bg-[#00D4C8] hover:bg-[#00A89E] text-[#1A1D23] font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-[#00D4C8]/20"
        >
          <Sparkles className="w-5 h-5" />
          Générer une annonce avec l'IA
        </Link>
      </div>
    </div>
  )
}
