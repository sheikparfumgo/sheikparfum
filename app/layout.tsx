import Sidebar from "@/components/home/Sidebar"
import Header from "@/components/home/Header"
import "@/app/globals.css"
import AuthInitializer from "@/components/auth/AuthInitializer"
import { Toaster } from "sonner"
import Footer from "@/components/home/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0F0F10] text-white">

        {/* Inicializa auth */}
        <AuthInitializer />

        {/* Toasts (independente de auth) */}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1c',
              border: '1px solid #2a2a2a',
              color: '#f5f5f5',
            }
          }}
        />

        {/* Layout base */}
        <div className="flex min-h-screen w-full overflow-x-hidden">

          {/* Sidebar */}
          <aside className="hidden md:block">
            <Sidebar />
          </aside>

          {/* Área principal */}
          <div className="flex flex-col flex-1 w-full overflow-x-hidden md:pl-64">

            {/* Header */}
            <Header />

            {/* Conteúdo */}
            <main
              className="
                  flex-1
                  w-full
                  max-w-full
                  px-3 sm:px-4 md:px-8
                  overflow-x-hidden
                "
            >
              {children}
            </main>

            {/* Footer */}
            <Footer />

          </div>

        </div>

      </body>
    </html>
  )
}