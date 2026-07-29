import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { makeQueryClient } from '@/lib/queryClient'

// Root layout route: wraps every page in the query + auth contexts and site chrome.
// A per-instance QueryClient (useState initializer) avoids sharing cache across the
// separate app instances that SSG spins up while pre-rendering each route.
export default function App() {
  const [queryClient] = useState(makeQueryClient)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
              <Outlet />
            </main>
            <Footer />
          </div>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
