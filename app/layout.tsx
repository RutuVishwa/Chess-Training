import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Brain } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Endgame - Where AI Learning Begins',
  description: 'Master chess with personalized AI training, puzzles, and game analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Navigation */}
          <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Brain className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-xl font-bold text-white">Endgame</div>
                    <div className="text-xs text-blue-400">Where AI Learning Begins</div>
                  </div>
                </Link>
                <div className="flex items-center gap-6">
                  <Link 
                    href="/train" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Training
                  </Link>
                  <Link 
                    href="/learn" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Learn
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800 py-8 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">© 2024 Endgame. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6">
                  <Link 
                    href="/about" 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    href="/privacy" 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
