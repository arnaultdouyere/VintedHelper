import { createClient } from '@/lib/supabase/server'
import GenerateForm from './components/GenerateForm'
import { redirect } from 'next/navigation'

export default async function GeneratePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('folders').select('*').order('created_at', { ascending: true })

  const isV1Folder = (name: string) => !name.startsWith('[a]') && !name.startsWith('[e]')
  
  // Only Annonce folders
  const rawAnnonce = (data || []).filter(f => f.name.startsWith('[a]') || isV1Folder(f.name)).map(f => ({
    ...f,
    ui_name: f.name.startsWith('[a]') ? f.name.substring(3) : f.name
  }))

  const buildFolderPaths = (folders: any[]) => {
      const folderMap = new Map();
      folders.forEach(f => folderMap.set(f.id, f));

      return folders.map(f => {
         let path = f.ui_name;
         let current = f;
         let safety = 0;
         while (current.parent_id && folderMap.has(current.parent_id) && safety < 10) {
             current = folderMap.get(current.parent_id);
             path = current.ui_name + ' > ' + path;
             safety++;
         }
         return { ...f, ui_name: path };
      }).sort((a, b) => a.ui_name.localeCompare(b.ui_name));
  }
  
  const annonceFolders = buildFolderPaths(rawAnnonce);

  return (
    <div className="flex flex-col h-full bg-[#0A0F1E] overflow-y-auto">
      <div className="px-8 py-6 border-b border-white/[0.06] bg-[#080D1A] sticky top-0 z-10">
         <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Module IA</p>
         <h1 className="text-2xl font-bold text-white tracking-tight">Générateur d'Annonces</h1>
      </div>
      <div className="p-8">
         <p className="text-slate-400 mb-8 text-sm">Transformez vos photos en annonces Vinted parfaitement rédigées.</p>
         
         <GenerateForm folders={annonceFolders} userId={user.id} />
      </div>
    </div>
  )
}
