'use client'

import { useEffect, useRef, useState } from 'react'

interface SiteLoaderProps {
  isLoaded: boolean
  onComplete?: () => void
}

const TICKS = 56
const MARK_EVERY = 8
const KF = [
  [0, 0],
  [0.05, 12],
  [0.12, 18],
  [0.18, 28],
  [0.25, 36],
  [0.35, 48],
  [0.45, 58],
  [0.55, 68],
  [0.68, 78],
  [0.8, 88],
  [0.9, 94],
  [1.0, 100],
]

const PHASES: [number, string][] = [
  [0, 'INITIALIZING CORE SYSTEMS'],
  [22, 'ESTABLISHING SECURE UPLINK'],
  [50, 'SYNCHRONIZING 3D WORKSPACE'],
  [75, 'COMPILING SHADERS & LIGHTS'],
  [100, 'WORKSPACE UPLINK ESTABLISHED'],
]

const easeOut = (x: number) => 1 - Math.pow(1 - x, 2.1)

const valueAt = (u: number) => {
  if (u >= 1) return 100
  for (let i = 0; i < KF.length - 1; i++) {
    const [t0, v0] = KF[i]
    const [t1, v1] = KF[i + 1]
    if (u <= t1) return v0 + (v1 - v0) * easeOut((u - t0) / (t1 - t0))
  }
  return 100
}

const phaseFor = (p: number): string => {
  let t = PHASES[0][1]
  for (const [k, v] of PHASES) if (p >= k) t = v
  return t
}

export default function SiteLoader({ isLoaded, onComplete }: SiteLoaderProps) {
  const [scale, setScale] = useState(1)
  const [pct, setPct] = useState(0)
  const [litCount, setLitCount] = useState(0)
  const [flashIndex, setFlashIndex] = useState(-1)
  const [status, setStatus] = useState('INITIALIZING CORE SYSTEMS')
  const [dots, setDots] = useState('...')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [grain1, setGrain1] = useState('')
  const [grain2, setGrain2] = useState('')

  const isLoadedRef = useRef(isLoaded)
  isLoadedRef.current = isLoaded

  // Responsive scale factor (1200x800 design canvas)
  useEffect(() => {
    const updateScale = () => {
      const s = Math.min(window.innerWidth / 1200, window.innerHeight / 800)
      setScale(Math.max(0.3, s))
    }
    updateScale()
    window.addEventListener('resize', updateScale, { passive: true })
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Procedural noise grain generation
  useEffect(() => {
    const N = 128
    const make = (fn: (d: Uint8ClampedArray, o: number) => void) => {
      const c = document.createElement('canvas')
      c.width = c.height = N
      const ctx = c.getContext('2d')
      if (!ctx) return ''
      const img = ctx.createImageData(N, N)
      for (let i = 0; i < N * N; i++) fn(img.data, i * 4)
      ctx.putImageData(img, 0, 0)
      return c.toDataURL()
    }
    const g = () => (Math.random() + Math.random() + Math.random() + Math.random()) / 4

    setGrain1(
      make((d, o) => {
        const v = 128 + (g() - 0.5) * 300
        d[o] = d[o + 1] = d[o + 2] = Math.max(0, Math.min(255, v))
        d[o + 3] = 255
      })
    )

    setGrain2(
      make((d, o) => {
        const v = Math.random()
        d[o] = d[o + 1] = d[o + 2] = 255
        d[o + 3] = v < 0.86 ? 0 : Math.round(((v - 0.86) / 0.14) * 190)
      })
    )
  }, [])

  // Animation timeline tracking 3D load
  useEffect(() => {
    let animId: number
    const start = performance.now()
    const DURATION = 3800 // base progressive duration if waiting

    const frame = (now: number) => {
      const elapsed = now - start
      let progress = 0

      if (isLoadedRef.current) {
        // Fast-forward to 100% when 3D workstation is ready
        progress = 1
      } else {
        // Natural progression pausing near ~88% until 3D signals ready
        const rawProgress = Math.min(0.88, elapsed / DURATION)
        progress = valueAt(rawProgress) / 100
      }

      const shown = Math.round(progress * 100)
      setPct(shown)
      setStatus(phaseFor(shown))

      const lit = Math.round((shown / 100) * TICKS)
      setLitCount((prevLit) => {
        if (lit > prevLit) {
          setFlashIndex(lit - 1)
        }
        return lit
      })

      const dCount = shown >= 100 ? 0 : Math.floor((elapsed / 360) % 4)
      setDots('...'.slice(0, dCount))

      if (shown < 100 || !isLoadedRef.current) {
        animId = requestAnimationFrame(frame)
      }
    }

    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [isLoaded])

  // Fade-out transition when fully loaded
  useEffect(() => {
    if (pct >= 100 && isLoaded) {
      const timer = setTimeout(() => {
        setIsFadingOut(true)
        onComplete?.()
      }, 420)

      const removeTimer = setTimeout(() => {
        setIsDone(true)
      }, 1150)

      return () => {
        clearTimeout(timer)
        clearTimeout(removeTimer)
      }
    }
  }, [pct, isLoaded, onComplete])

  if (isDone) return null

  const barW = 604
  const tickW = 5.4
  const gap = (barW - TICKS * tickW) / (TICKS - 1)
  const pitch = tickW + gap
  const hazeWidth = litCount > 0 ? (litCount - 1) * pitch + tickW + gap / 2 : 0

  return (
    <div
      className={`uplink-viewport ${isFadingOut ? 'uplink-viewport--exit' : ''}`}
      style={{ '--s': scale } as React.CSSProperties}
      role="status"
      aria-label="Loading portfolio workstation"
    >
      {/* Warm ambient pool of light */}
      <div className="uplink-pool" />

      {/* 1200 x 800 scaled stage */}
      <div className="uplink-scene">
        <div className="uplink-stage">
          {/* Dynamic glowing haze following the lit ticks */}
          <div className="uplink-haze">
            <i
              style={{
                width: `calc(${hazeWidth}px + 250px)`,
              }}
              className={flashIndex >= 0 ? 'pulse' : ''}
            />
          </div>

          {/* Readout plate with chamfered corners */}
          <div className={`uplink-plate ${pct === 100 ? 'hit' : ''}`} />
          <div className="uplink-brk tr" />
          <div className="uplink-brk bl" />

          {/* Neon percentage readout */}
          <div className="uplink-readout">
            <b>{pct}</b>
            <u>%</u>
          </div>

          {/* System brand & label */}
          <div className="uplink-barlabel">
            <span>AYUSH</span> // WORKSPACE UPLINK
          </div>

          {/* Skewed telemetry ticks */}
          <div className="uplink-bar">
            {Array.from({ length: TICKS }, (_, i) => {
              const isMark = (i + 1) % MARK_EVERY === 0
              const isOn = i < litCount
              const isFlash = i === flashIndex
              return (
                <i
                  key={i}
                  className={`uplink-tick ${isMark ? 'mk' : ''} ${isOn ? 'on' : ''} ${
                    isFlash ? 'flash' : ''
                  }`}
                />
              )
            })}
          </div>

          {/* Telemetry phase status */}
          <div className="uplink-status">
            {status}
            <span className="uplink-dots">{dots}</span>
          </div>

          {/* Technical corner markers */}
          <div className="uplink-marker m-tl">
            <i className="h a-h" />
            <i className="v a-v" />
            <i className="h b-h" />
            <i className="v b-v" />
            <i className="h c-h" />
            <i className="v c-v" />
            <i className="h d-h" />
            <i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="uplink-marker m-tr">
            <i className="h a-h" />
            <i className="v a-v" />
            <i className="h b-h" />
            <i className="v b-v" />
            <i className="h c-h" />
            <i className="v c-v" />
            <i className="h d-h" />
            <i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="uplink-marker m-bl">
            <i className="h a-h" />
            <i className="v a-v" />
            <i className="h b-h" />
            <i className="v b-v" />
            <i className="h c-h" />
            <i className="v c-v" />
            <i className="h d-h" />
            <i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="uplink-marker m-br">
            <i className="h a-h" />
            <i className="v a-v" />
            <i className="h b-h" />
            <i className="v b-v" />
            <i className="h c-h" />
            <i className="v c-v" />
            <i className="h d-h" />
            <i className="v d-v" />
            <i className="dia" />
          </div>

          {/* Mirrored side rails with telemetry modules */}
          <div className="uplink-rail left">
            <div className="wire" />
            <div className="cap a" />
            <div className="cap b" />
            <div className="mod">
              <div className="hatch" />
              <div className="ret" />
              <div className="dot" />
              <div className="slab" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
            </div>
          </div>
          <div className="uplink-rail right">
            <div className="wire" />
            <div className="cap a" />
            <div className="cap b" />
            <div className="mod">
              <div className="hatch" />
              <div className="ret" />
              <div className="dot" />
              <div className="slab" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
            </div>
          </div>
        </div>
      </div>

      {/* Scanline CRT overlay */}
      <div className="uplink-scan" />

      {/* Procedural film grain overlays */}
      {grain1 && (
        <div
          className="uplink-grain mul"
          style={{ backgroundImage: `url(${grain1})` }}
        />
      )}
      {grain2 && (
        <div
          className="uplink-grain add"
          style={{ backgroundImage: `url(${grain2})` }}
        />
      )}
    </div>
  )
}
