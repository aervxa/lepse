import { Button } from '@/app/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function HomePage() {
  return (
    <>
      {/* Content */}
      <div className="flex flex-col items-center-safe gap-12 p-6 pt-16 pb-96">
        <Button variant="outline" size="xs" className="-mb-8">
          <span className="mr-1 size-2 rounded-full bg-yellow-700" />
          What is Lepse?
        </Button>
        <p className="max-w-[15ch] text-center text-4xl leading-tight font-medium sm:text-5xl md:text-6xl lg:text-7xl">
          Aesthetic productivity made easy
        </p>

        {/* Dowload buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="xl">
            Download for Windows
            <ChevronDown />
          </Button>
          <Button variant="secondary" size="xl">
            Open in browser
          </Button>
        </div>

        <p className="text-muted-foreground -mb-8 text-sm">An image example:</p>
        <div className="bg-accent aspect-video w-full max-w-5xl rounded-2xl"></div>
      </div>
    </>
  )
}
