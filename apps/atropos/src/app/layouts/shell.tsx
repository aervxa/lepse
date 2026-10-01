import { Button } from '../components/ui/button'
import { Document } from '../document'

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Document>
      <main className="bg-sidebar flex h-dvh flex-col">
        {/* Navbar */}
        <nav className="flex. justify-between. mx-auto grid h-12 w-full max-w-6xl grid-cols-3 items-center px-4">
          <a href="/" className="flex items-center gap-2 select-none">
            <img src="/favicon.svg" className="size-6" />
            <p className="text-xl font-medium">lepse</p>
          </a>

          <div className="flex place-content-center gap-2">
            <Button variant="link">
              <a href="/">Home</a>
            </Button>
            <Button variant="link">
              <a href="/">About</a>
            </Button>
            <Button variant="link">
              <a href="/">Contact us</a>
            </Button>
          </div>

          {/* TODO: Mobile breakpoint */}
          {/* Action */}
          <div className="flex place-content-end gap-2">
            <Button variant="outline" size="sm" className="font-medium">
              Open in browser
            </Button>
            <Button size="sm" className="font-medium">
              Download now
            </Button>
          </div>
        </nav>

        {/* Shell */}
        <section className="bg-background outline-border/50 relative z-0 m-2 mt-0 flex-1 overflow-hidden rounded-lg outline-2">
          <div className="absolute inset-0 -z-10">
            <img
              src="/images/backgrounds/lines-teal.webp"
              className="pointer-events-none -z-10 size-full object-cover blur-xs brightness-90 -hue-rotate-60 saturate-150 opacity-40"
            />
          </div>
          {/*:class="{ 'blur-xs': blurBackground, 'brightness-75': darkenBackground }"*/}

          <div className="flex size-full flex-col overflow-auto *:[[id=hydrate-root]]:h-full">
            {children}
          </div>
        </section>
      </main>
    </Document>
  )
}
