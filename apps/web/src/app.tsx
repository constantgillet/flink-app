import { useState } from 'react'
import { Header } from './components/header'
import { LinkForm } from './components/link-form'
import { LinkResult } from './components/link-result'
import { RecentLinks } from './components/recent-links'
import type { ShortenedLink } from './types'

function App() {
  const [result, setResult] = useState<ShortenedLink | null>(null)
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([])

  const handleSuccess = (link: ShortenedLink) => {
    setResult(link)
    setRecentLinks((prev) => [link, ...prev.filter((l) => l.shortCode !== link.shortCode)])
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="bg-background-intent min-h-[calc(100vh-78px)] flex flex-col">
        <section className="container mx-auto px-4 flex-1 flex items-start py-12 xl:pt-[15vh] xl:pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16 w-full">
            <div>
              <div className="space-y-6 xl:space-y-8 max-w-lg mx-auto xl:mx-0">
                <h1 className="text-4xl xl:text-6xl font-bold font-serif leading-tight xl:leading-18 text-center xl:text-left">
                  Shorten your links instantly
                </h1>
                <p className="text-lg xl:text-2xl text-muted-foreground leading-7 xl:leading-8 text-center xl:text-left">
                  Shorten your links to make them easier to share. Reduce long URLs to a short and
                  memorable one.
                </p>
                <img
                  src="/images/hero.webp"
                  alt="Shorten your links instantly"
                  className="w-full max-w-[392px] mx-auto hidden xl:block"
                />
              </div>
            </div>
            <div>
              <div className="rounded-none bg-white p-6 xl:p-8">
                <LinkForm onSuccess={handleSuccess} />
                {result && <LinkResult link={result} />}
              </div>
              {recentLinks.length > 0 && (
                <div className="mt-8">
                  <RecentLinks links={recentLinks} />
                </div>
              )}
            </div>
          </div>
        </section>
        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
          <p>flink.io - All rights reserved</p>
        </footer>
      </main>
    </div>
  )
}

export default App
