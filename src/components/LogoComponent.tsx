import { Suspense } from 'react'
import { AquariumScene } from './AquariumScene'

const FallbackLogo = () => (
  <div className="flex size-12 animate-pulse items-center justify-center rounded-lg bg-gradient-to-br from-gray-400 to-gray-800" />
)

export function LogoComponent() {
  return (
    <div className="size-16 cursor-crosshair">
      <Suspense fallback={<FallbackLogo />}>
        <AquariumScene />
      </Suspense>
    </div>
  )
}
