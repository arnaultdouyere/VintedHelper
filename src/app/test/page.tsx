import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TestPage() {
  const urlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const keySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let dbStatus = "Non testé"
  let authStatus = "Non testé"
  let dbError = ""
  let authError = ""

  if (urlSet && keySet) {
    try {
      const supabase = await createClient()
      
      // Test DB
      const { error: dbErr } = await supabase.from('folders').select('id').limit(1)
      if (dbErr) {
        dbStatus = "Erreur"
        dbError = dbErr.message
      } else {
        dbStatus = "Connecté"
      }

      // Test Auth
      const { error: authErr } = await supabase.auth.getSession()
      if (authErr) {
        authStatus = "Erreur"
        authError = authErr.message
      } else {
        authStatus = "Connecté"
      }

    } catch (e: any) {
       dbStatus = "Erreur fatale"
       dbError = e.message
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Diagnostic Supabase</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Variables d'environnement (.env.local)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
            <span className={urlSet ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {urlSet ? "DÉFINIE" : "MANQUANTE"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <span className={keySet ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {keySet ? "DÉFINIE" : "MANQUANTE"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connexion à la Base de Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
              <span>Statut de la table "folders"</span>
              <span className={dbStatus === "Connecté" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {dbStatus}
              </span>
            </div>
            {dbError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded mt-2">
                <strong>Erreur exacte :</strong> {dbError}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connexion à l'Authentification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
              <span>Service d'auth (getSession)</span>
              <span className={authStatus === "Connecté" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {authStatus}
              </span>
            </div>
            {authError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded mt-2">
                <strong>Erreur exacte :</strong> {authError}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-slate-500">
        Si l'inscription échoue mais que les voyants ici sont verts, il est fort probable que Supabase demande une <strong>confirmation d'email</strong>. Par défaut sur les nouveaux projets Supabase, la fonctionnalité "Confirm email" est activée. Essayez d'aller dans (Authentication > Providers > Email) sur Supabase.com et désactivez "Confirm email" pour tester facilement en local.
      </div>

    </div>
  )
}
