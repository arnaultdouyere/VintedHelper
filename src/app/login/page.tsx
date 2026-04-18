import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-[#0A0A0B] text-slate-50 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold tracking-tighter shadow-lg mb-4">
             VH
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Bienvenue</h1>
           <p className="text-slate-400 text-sm mt-1">Connectez-vous à votre espace VintedHelper</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-slate-300 ml-1">Email professionnel ou personnel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-11 rounded-xl focus-visible:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-slate-300 ml-1">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 h-11 rounded-xl focus-visible:ring-indigo-500"
            />
          </div>
          
          {searchParams?.message && (
            <div className="text-sm font-medium text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-xl mt-2 line-clamp-3">
              Erreur : {searchParams.message}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <Button formAction={login} type="submit" className="w-full h-11 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold shadow-md active:scale-[0.98] transition-transform">
              Se connecter
            </Button>
            <Button formAction={signup} type="submit" variant="ghost" className="w-full h-11 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all">
              Créer un compte
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
