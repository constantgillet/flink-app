import { Button } from './button'

const Header = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/images/logo.webp" alt="Flink" className="size-10" />
          <h1 className="text-2xl font-bold font-serif">Flink</h1>
        </div>

        <Button
          variant="primary"
          size="large"
          onPress={() => document.getElementById('url')?.focus()}
        >
          Get Started - <span className="italic">It's free</span>
        </Button>
      </div>
    </header>
  )
}

export { Header }
