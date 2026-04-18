import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenue, {user.email?.split('@')[0]}</h1>
      <p className="text-slate-600">
        Sélectionnez un dossier dans la barre latérale pour commencer, ou créez-en un nouveau.
      </p>
    </div>
  )
}
