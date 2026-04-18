import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-slate-50 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar Minimaliste */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/10 z-10 bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-xs tracking-tighter shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            VH
          </div>
          <span className="font-semibold text-lg tracking-tight">VintedHelper</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Connexion
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-semibold h-9 text-sm transition-transform active:scale-95">
              Démarrer
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-0">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
           <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
           <span className="text-xs font-medium text-slate-300">VintedHelper v2.0 est en ligne</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6">
          Vendez mieux. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Cherchez intelligemment.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 font-medium">
          L'outil métier ultime pour structurer vos annonces, organiser votre veille concurrentielle et préparer vos lancements Vinted dans une interface pensée pour la productivité.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-white text-black hover:bg-slate-200 rounded-full px-8 text-base shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform active:scale-95 h-12">
              Créer mon espace
            </Button>
          </Link>
          <Link href="https://github.com/vintedhelper" target="_blank">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
              Découvrir les fonctionnalités
            </Button>
          </Link>
        </div>
      </main>
      
      {/* Footer Minimal */}
      <footer className="py-6 border-t border-white/10 text-center text-sm text-slate-500">
         © {new Date().getFullYear()} VintedHelper. Conçu pour l'efficacité.
      </footer>
    </div>
  )
}
