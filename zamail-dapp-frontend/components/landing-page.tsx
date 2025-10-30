"use client"

interface LandingPageProps {
  onConnect: () => void
}

export function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper relative overflow-hidden">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-paper-texture" />

      <div className="relative z-10 text-center space-y-12 px-4">
        {/* Logo with calligraphy style */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-serif text-ink tracking-wider">ZAMAIL</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-vermillion" />
            <p className="text-xl md:text-2xl text-muted-ink font-serif italic">Digital Calligraphy</p>
            <div className="h-px w-16 bg-vermillion" />
          </div>
        </div>

        {/* Seal stamp effect */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-vermillion/20 border-4 border-vermillion flex items-center justify-center rotate-12">
            <span className="text-vermillion font-bold text-2xl">封</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-ink max-w-md mx-auto font-serif leading-relaxed">
          Fully encrypted email system on blockchain. Absolute security with FHEVM technology.
        </p>

        {/* Connect button with ink effect */}
        <button
          onClick={onConnect}
          className="group relative px-12 py-4 bg-vermillion text-white rounded-lg text-xl font-serif transition-all hover:scale-105 hover:shadow-xl overflow-hidden"
        >
          <span className="relative z-10">Connect Wallet</span>
          <div className="absolute inset-0 bg-ink opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>

        {/* Decorative brush strokes */}
        <div className="flex justify-center gap-8 mt-12">
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-muted-ink to-transparent" />
          <div className="w-1 h-20 bg-gradient-to-b from-transparent via-muted-ink to-transparent" />
          <div className="w-1 h-16 bg-gradient-to-b from-transparent via-muted-ink to-transparent" />
        </div>
      </div>
    </div>
  )
}
