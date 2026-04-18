import Sidebar from '@/app/dashboard/components/Sidebar'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>

      <Toaster />
    </div>
  )
}
