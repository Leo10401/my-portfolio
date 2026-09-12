'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Html, ContactShadows, Environment, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Box({ position, size, color = '#17191e', clearcoat = 0.15, ...props }: { position: [number, number, number]; size: [number, number, number]; color?: string; clearcoat?: number; rotation?: [number, number, number]; castShadow?: boolean; receiveShadow?: boolean }) {
  return <RoundedBox args={size} position={position} radius={0.045} smoothness={3} {...props}><meshPhysicalMaterial color={color} roughness={0.35} metalness={0.45} clearcoat={clearcoat} clearcoatRoughness={0.3} envMapIntensity={0.6} /></RoundedBox>
}

function Rod({ from, to, radius = 0.03, color = '#2c2d33' }: { from: [number, number, number]; to: [number, number, number]; radius?: number; color?: string }) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const dir = new THREE.Vector3().subVectors(end, start)
    const length = dir.length()
    const position = start.clone().lerp(end, 0.5)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    return { position, quaternion, length }
  }, [from, to])
  return <mesh position={position} quaternion={quaternion} castShadow>
    <cylinderGeometry args={[radius, radius, length, 12]} />
    <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.6} clearcoat={0.3} />
  </mesh>
}

function Screen() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 750
    const c = canvas.getContext('2d')!
    c.fillStyle = '#0b101b'; c.fillRect(0, 0, 1200, 750)
    c.fillStyle = '#1e2431'; c.fillRect(0, 0, 1200, 55)
    ;['#ff6656', '#ffbc43', '#58c97c'].forEach((color, i) => { c.fillStyle = color; c.beginPath(); c.arc(26 + i * 25, 27, 7, 0, Math.PI * 2); c.fill() })
    c.font = '20px monospace'; c.fillStyle = '#969eb3'; c.fillText('portfolio / src / App.tsx', 135, 35)
    c.fillStyle = '#151b29'; c.fillRect(0, 55, 65, 695)
    const lines = ["import React from 'react';", '', 'const developer = {', "  name: 'Ayush Kumar Yadav',", "  role: 'Full Stack Developer',", "  passion: 'Building useful things',", "  coffee: true", '};', '', 'export default function Portfolio() {', '  return (', '    <Developer', '      curiosity="limitless"', '      ideas={turnedIntoReality}', '    />', '  );', '}']
    lines.forEach((line, i) => { c.font = '19px monospace'; c.fillStyle = '#525b70'; c.fillText(String(i + 1).padStart(2, ' '), 22, 101 + i * 35); c.font = '25px monospace'; c.fillStyle = i === 0 || i === 9 ? '#cc99ef' : i > 10 ? '#ffb55c' : '#90d4c8'; c.fillText(line, 95, 101 + i * 35) })
    // faint scanline / vignette so the panel doesn't read as a flat decal
    const grad = c.createRadialGradient(600, 375, 200, 600, 375, 760); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,0.35)')
    c.fillStyle = grad; c.fillRect(0, 0, 1200, 750)
    const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return <group>
    <mesh position={[0, 1.72, 0.12]}><planeGeometry args={[3.76, 2.35]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    {/* thin glass layer for a believable specular highlight over the panel */}
    <mesh position={[0, 1.72, 0.125]}><planeGeometry args={[3.76, 2.35]} /><meshPhysicalMaterial color="#a9c6ff" roughness={0.06} metalness={0} transmission={0.9} thickness={0.05} transparent opacity={0.06} envMapIntensity={1.4} /></mesh>
  </group>
}

function CoffeeSteam({ animate }: { animate: boolean }) {
  const count = 12
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([])

  const smokeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)')
    grad.addColorStop(0.25, 'rgba(248, 244, 238, 0.35)')
    grad.addColorStop(0.6, 'rgba(235, 230, 222, 0.12)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 128)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  useEffect(() => {
    return () => {
      smokeTexture?.dispose()
    }
  }, [smokeTexture])

  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 2.5
    for (let i = 0; i < count; i++) {
      const sprite = spriteRefs.current[i]
      if (!sprite) continue
      const offset = i / count
      const progress = (t * 0.26 + offset) % 1
      // Y rises smoothly from the coffee surface up into the air
      const y = 0.18 + progress * 0.72
      // Organic undulating drift as smoke wafts upwards
      const swayX = Math.sin(t * 1.6 + i * 2.2) * (0.015 + progress * 0.09) + (i % 2 === 0 ? 0.015 : -0.015) * progress
      const swayZ = Math.cos(t * 1.3 + i * 1.8) * (0.015 + progress * 0.07)
      sprite.position.set(swayX, y, swayZ)

      // Puff gently expands as it rises and disperses
      const scale = 0.11 + progress * 0.32
      sprite.scale.set(scale, scale * 1.2, 1)

      // Natural smoke opacity curve: fades in from coffee, peaks, then dissolves into air
      const opacity = Math.pow(Math.sin(progress * Math.PI), 1.25) * 0.35
      ;(sprite.material as THREE.SpriteMaterial).opacity = opacity
    }
  })

  if (!smokeTexture) return null

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            spriteRefs.current[i] = el
          }}
          position={[0, 0.2, 0]}
        >
          <spriteMaterial
            map={smokeTexture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

function Desk({ animate, onLoaded }: { animate: boolean; onLoaded?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const lamp = useRef<THREE.PointLight>(null)
  const led = useRef<THREE.Mesh>(null)
  const loadedNotified = useRef(false)

  useFrame(({ pointer, clock }, delta) => {
    if (!loadedNotified.current) {
      loadedNotified.current = true
      requestAnimationFrame(() => {
        onLoaded?.()
      })
    }
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.16 + (animate ? pointer.x * 0.12 : 0), 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, animate ? -pointer.y * 0.05 : 0, 3, delta)
    group.current.position.y = -0.6 + (animate ? Math.sin(t * 0.9) * 0.06 : 0)
    if (lamp.current && animate) lamp.current.intensity = 5 + Math.sin(t * 7) * 0.35 + Math.sin(t * 13) * 0.2
    if (led.current) (led.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4 + Math.sin(t * 2) * 0.4
  })
  const keys = useMemo(() => {
    const u = 0.108
    const gap = 0.012
    const w1 = u - gap
    const d1 = u - gap

    const z0 = 0.94
    const z1 = 1.08
    const z2 = z1 + 1.0 * u
    const z3 = z1 + 2.0 * u
    const z4 = z1 + 3.0 * u
    const z5 = z1 + 4.0 * u

    const xStart = -1.311
    const xNav = xStart + 15.4 * u
    const xPad = xNav + 3.4 * u

    const list: {
      id: string
      x: number
      z: number
      w: number
      d: number
      color?: string
      topColor?: string
      emissive?: string
      emissiveIntensity?: number
    }[] = []

    // --- Row 0: Function Row (z0) ---
    // Esc (isolated)
    list.push({ id: 'esc', x: xStart + 0.5 * u, z: z0, w: w1, d: d1, color: '#d96414', topColor: '#ff811f', emissive: '#ff811f', emissiveIntensity: 0.6 })
    // F1 - F4
    for (let i = 0; i < 4; i++) list.push({ id: `f${i + 1}`, x: xStart + (2.0 + i + 0.5) * u, z: z0, w: w1, d: d1 })
    // F5 - F8
    for (let i = 0; i < 4; i++) list.push({ id: `f${i + 5}`, x: xStart + (6.5 + i + 0.5) * u, z: z0, w: w1, d: d1 })
    // F9 - F12
    for (let i = 0; i < 4; i++) list.push({ id: `f${i + 9}`, x: xStart + (11.0 + i + 0.5) * u, z: z0, w: w1, d: d1 })
    // Nav row 0: PrtSc, ScrollLock, Pause
    for (let i = 0; i < 3; i++) list.push({ id: `nav-0-${i}`, x: xNav + (i + 0.5) * u, z: z0, w: w1, d: d1 })

    // --- Row 1: Number Row (z1) ---
    for (let i = 0; i < 13; i++) list.push({ id: `num-${i}`, x: xStart + (i + 0.5) * u, z: z1, w: w1, d: d1 })
    list.push({ id: 'bsp', x: xStart + 14.0 * u, z: z1, w: 2 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    for (let i = 0; i < 3; i++) list.push({ id: `nav-1-${i}`, x: xNav + (i + 0.5) * u, z: z1, w: w1, d: d1 })
    for (let i = 0; i < 4; i++) list.push({ id: `pad-1-${i}`, x: xPad + (i + 0.5) * u, z: z1, w: w1, d: d1, color: i === 3 ? '#282b36' : undefined })

    // --- Row 2: Tab Row (z2) ---
    list.push({ id: 'tab', x: xStart + 0.75 * u, z: z2, w: 1.5 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    for (let i = 0; i < 12; i++) {
      const isW = i === 1
      list.push({
        id: `r2-${i}`,
        x: xStart + (1.5 + i + 0.5) * u,
        z: z2,
        w: w1,
        d: d1,
        color: isW ? '#2a2e3d' : undefined,
        topColor: isW ? '#353c50' : undefined,
        emissive: isW ? '#5fd4ff' : undefined,
        emissiveIntensity: isW ? 0.9 : 0,
      })
    }
    list.push({ id: 'bslash', x: xStart + 14.25 * u, z: z2, w: 1.5 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    for (let i = 0; i < 3; i++) list.push({ id: `nav-2-${i}`, x: xNav + (i + 0.5) * u, z: z2, w: w1, d: d1 })
    for (let i = 0; i < 3; i++) list.push({ id: `pad-2-${i}`, x: xPad + (i + 0.5) * u, z: z2, w: w1, d: d1 })
    list.push({ id: 'pad-plus', x: xPad + 3.5 * u, z: (z2 + z3) / 2, w: w1, d: 2 * u - gap, color: '#282b36', topColor: '#333744' })

    // --- Row 3: Caps Row (z3) ---
    list.push({ id: 'caps', x: xStart + 0.875 * u, z: z3, w: 1.75 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    for (let i = 0; i < 11; i++) {
      const isASD = i === 0 || i === 1 || i === 2
      list.push({
        id: `r3-${i}`,
        x: xStart + (1.75 + i + 0.5) * u,
        z: z3,
        w: w1,
        d: d1,
        color: isASD ? '#2a2e3d' : undefined,
        topColor: isASD ? '#353c50' : undefined,
        emissive: isASD ? '#5fd4ff' : undefined,
        emissiveIntensity: isASD ? 0.9 : 0,
      })
    }
    list.push({ id: 'enter', x: xStart + 13.875 * u, z: z3, w: 2.25 * u - gap, d: d1, color: '#8e502b', topColor: '#b06536', emissive: '#ff811f', emissiveIntensity: 0.4 })
    for (let i = 0; i < 3; i++) list.push({ id: `pad-3-${i}`, x: xPad + (i + 0.5) * u, z: z3, w: w1, d: d1 })

    // --- Row 4: Shift Row (z4) ---
    list.push({ id: 'lshift', x: xStart + 1.125 * u, z: z4, w: 2.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    for (let i = 0; i < 10; i++) list.push({ id: `r4-${i}`, x: xStart + (2.25 + i + 0.5) * u, z: z4, w: w1, d: d1 })
    list.push({ id: 'rshift', x: xStart + 13.625 * u, z: z4, w: 2.75 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'arr-up', x: xNav + 1.5 * u, z: z4, w: w1, d: d1, color: '#2a2e3d', topColor: '#353c50', emissive: '#5fd4ff', emissiveIntensity: 0.6 })
    for (let i = 0; i < 3; i++) list.push({ id: `pad-4-${i}`, x: xPad + (i + 0.5) * u, z: z4, w: w1, d: d1 })
    list.push({ id: 'pad-enter', x: xPad + 3.5 * u, z: (z4 + z5) / 2, w: w1, d: 2 * u - gap, color: '#8e502b', topColor: '#b06536', emissive: '#ff811f', emissiveIntensity: 0.4 })

    // --- Row 5: Bottom Row (z5) ---
    list.push({ id: 'lctrl', x: xStart + 0.625 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'lwin', x: xStart + 1.875 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'lalt', x: xStart + 3.125 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'space', x: xStart + 6.875 * u, z: z5, w: 6.25 * u - gap, d: d1, color: '#262832', topColor: '#333744' })
    list.push({ id: 'ralt', x: xStart + 10.625 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'rwin', x: xStart + 11.875 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'menu', x: xStart + 13.125 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'rctrl', x: xStart + 14.375 * u, z: z5, w: 1.25 * u - gap, d: d1, color: '#242630', topColor: '#2f3240' })
    list.push({ id: 'arr-left', x: xNav + 0.5 * u, z: z5, w: w1, d: d1, color: '#2a2e3d', topColor: '#353c50', emissive: '#5fd4ff', emissiveIntensity: 0.6 })
    list.push({ id: 'arr-down', x: xNav + 1.5 * u, z: z5, w: w1, d: d1, color: '#2a2e3d', topColor: '#353c50', emissive: '#5fd4ff', emissiveIntensity: 0.6 })
    list.push({ id: 'arr-right', x: xNav + 2.5 * u, z: z5, w: w1, d: d1, color: '#2a2e3d', topColor: '#353c50', emissive: '#5fd4ff', emissiveIntensity: 0.6 })
    list.push({ id: 'pad-0', x: xPad + 1.0 * u, z: z5, w: 2 * u - gap, d: d1 })
    list.push({ id: 'pad-dot', x: xPad + 2.5 * u, z: z5, w: w1, d: d1 })

    return list
  }, [])
  const lampBaseTop: [number, number, number] = [0, 0.035, 0.05]
  const lampElbow: [number, number, number] = [0.24, 0.86, 0.06]
  const lampNeck: [number, number, number] = [-0.06, 1.5, 0.22]
  return <group ref={group} rotation={[0, -0.16, 0]} position={[0, -0.6, 0]}>
    {/* desk slab + a faint reflective top coat so the monitor/keys ghost softly into the surface */}
    <Box position={[0, -0.13, 0.4]} size={[6.8, 0.16, 3.6]} color="#252020" clearcoat={0.1} castShadow receiveShadow />
    <mesh position={[0, -0.049, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6.7, 3.5]} />
      <MeshReflectorMaterial blur={[300, 80]} resolution={512} mixBlur={1} mixStrength={12} roughness={0.9} depthScale={0.3} minDepthThreshold={0.85} color="#171310" metalness={0.2} mirror={0} />
    </mesh>

    {/* monitor */}
    <Box position={[0, 1.72, 0]} size={[4.02, 2.62, 0.2]} castShadow />
    <Screen />
    <mesh ref={led} position={[1.7, 0.54, 0.11]}><circleGeometry args={[0.02, 12]} /><meshStandardMaterial color="#58c97c" emissive="#58c97c" emissiveIntensity={1.5} toneMapped={false} /></mesh>
    {/* monitor stand — wide base plate */}
    <Box position={[0, 0.01, 0.28]} size={[1.3, 0.05, 0.65]} color="#26272d" clearcoat={0.35} castShadow receiveShadow />
    {/* base front accent edge */}
    <mesh position={[0, 0.015, 0.605]}>
      <boxGeometry args={[1.1, 0.018, 0.006]} />
      <meshStandardMaterial color="#ff8a30" emissive="#ff8a30" emissiveIntensity={0.5} toneMapped={false} />
    </mesh>
    {/* vertical stand arm */}
    <mesh position={[0, 0.4, -0.02]} castShadow>
      <boxGeometry args={[0.13, 0.76, 0.09]} />
      <meshPhysicalMaterial color="#26272d" roughness={0.3} metalness={0.55} clearcoat={0.35} />
    </mesh>
    {/* arm-to-monitor mounting bracket */}
    <mesh position={[0, 0.7, -0.07]} castShadow>
      <boxGeometry args={[0.4, 0.18, 0.06]} />
      <meshPhysicalMaterial color="#222328" roughness={0.3} metalness={0.5} clearcoat={0.3} />
    </mesh>

    {/* keyboard: full 104-key layout matching reference illustration with sculpted beveled keycaps */}
    <group position={[0, 0, 0]}>
      {/* bottom chassis orange accent rim */}
      <Box position={[-0.08, 0.03, 1.25]} size={[2.72, 0.08, 0.86]} color="#ff811f" />
      {/* main sleek dark chassis */}
      <Box position={[-0.08, 0.085, 1.25]} size={[2.74, 0.10, 0.84]} color="#16181f" clearcoat={0.25} />
      {/* recessed switchbed plate */}
      <mesh position={[-0.08, 0.138, 1.25]}>
        <boxGeometry args={[2.56, 0.006, 0.74]} />
        <meshStandardMaterial color="#0e1015" roughness={0.7} />
      </mesh>
      {/* spacebar front accent edge line */}
      <mesh position={[-0.569, 0.192, 1.54]}>
        <boxGeometry args={[0.36, 0.004, 0.008]} />
        <meshStandardMaterial color="#ff811f" emissive="#ff811f" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* status indicator LEDs above numpad (Num, Caps, Scroll lock) */}
      {[-0.032, 0, 0.032].map((offset, i) => (
        <mesh key={i} position={[0.935 + offset, 0.142, 0.94]}>
          <boxGeometry args={[0.015, 0.004, 0.008]} />
          <meshStandardMaterial
            color={i === 0 ? '#58c97c' : '#333742'}
            emissive={i === 0 ? '#58c97c' : '#000000'}
            emissiveIntensity={i === 0 ? 1.5 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* individual sculpted keys with beveled inset top dish */}
      {keys.map((k) => {
        const insetW = Math.max(0.03, k.w - 0.02)
        const insetD = Math.max(0.03, k.d - 0.02)
        return (
          <group key={k.id} position={[k.x, 0.165, k.z]}>
            {/* outer keycap body with smooth rounded corners */}
            <RoundedBox args={[k.w, 0.045, k.d]} radius={0.008} smoothness={2} castShadow>
              <meshPhysicalMaterial
                color={k.color || '#262832'}
                roughness={0.4}
                metalness={0.2}
                clearcoat={0.3}
                clearcoatRoughness={0.25}
              />
            </RoundedBox>
            {/* sculpted beveled inner dish with framing border matching reference */}
            <mesh position={[0, 0.023, 0]}>
              <boxGeometry args={[insetW, 0.004, insetD]} />
              <meshPhysicalMaterial
                color={k.topColor || k.color || '#333744'}
                roughness={0.28}
                metalness={0.25}
                clearcoat={0.5}
                clearcoatRoughness={0.2}
                emissive={k.emissive ? new THREE.Color(k.emissive) : undefined}
                emissiveIntensity={k.emissiveIntensity || 0}
              />
            </mesh>
          </group>
        )
      })}
    </group>

    {/* mouse: smooth ergonomic body with scroll wheel and accent lighting */}
    <group position={[1.95, 0.04, 1.2]} rotation={[0, -0.1, 0]}>
      {/* main body — single smooth ellipsoid, bottom half hidden below desk surface */}
      <mesh scale={[0.30, 0.16, 0.42]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#1a1c22" roughness={0.25} metalness={0.12} clearcoat={0.65} clearcoatRoughness={0.18} />
      </mesh>
      {/* button seam — center dividing line */}
      <mesh position={[0, 0.1, 0.08]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.006, 0.08, 0.45]} />
        <meshStandardMaterial color="#08090d" roughness={0.7} />
      </mesh>
      {/* scroll wheel */}
      <mesh position={[0, 0.135, 0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.055, 16]} />
        <meshPhysicalMaterial color="#0c0d10" roughness={0.4} metalness={0.25} />
      </mesh>
      {/* scroll wheel accent ring */}
      <mesh position={[0, 0.135, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.004, 8, 16]} />
        <meshStandardMaterial color="#ff6c20" emissive="#ff6c20" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* left side accent strip */}
      <mesh position={[-0.275, 0.01, -0.02]} scale={[0.01, 0.04, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6c20" emissive="#ff6c20" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* right side accent strip */}
      <mesh position={[0.275, 0.01, -0.02]} scale={[0.01, 0.04, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6c20" emissive="#ff6c20" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>

    {/* plant */}
    <group position={[-2.6, 0.24, 0.24]}>
      <mesh castShadow><cylinderGeometry args={[0.26, 0.2, 0.5, 24]} /><meshPhysicalMaterial color="#252b28" roughness={0.5} clearcoat={0.2} /></mesh>
      <mesh position={[0, 0.25, 0]}><torusGeometry args={[0.26, 0.02, 8, 24]} /><meshStandardMaterial color="#1a201d" /></mesh>
      {Array.from({ length: 11 }, (_, i) => {
        const a = i * 2.399; const s = 0.85 + (i % 3) * 0.12
        return <mesh key={i} position={[Math.sin(a) * 0.15, 0.4 + (i % 3) * 0.03, Math.cos(a) * 0.15]} rotation={[Math.cos(a) * 0.45, a, Math.sin(a) * 0.45]} scale={[0.07 * s, 0.48 * s, 0.025]} castShadow>
          <sphereGeometry args={[1, 12, 12]} /><meshPhysicalMaterial color={i % 3 === 0 ? '#3d5c2b' : i % 3 === 1 ? '#496b32' : '#759442'} roughness={0.6} clearcoat={0.1} side={THREE.DoubleSide} />
        </mesh>
      })}
    </group>

    {/* desk lamp: base + two arm segments that actually meet at each joint, so the shade never floats free of the stand */}
    <group position={[2.7, 0, -0.1]}>
      <Box position={[0, 0, 0]} size={[0.65, 0.07, 0.6]} />
      <mesh position={lampBaseTop} castShadow><sphereGeometry args={[0.045, 16, 16]} /><meshPhysicalMaterial color="#3a3b40" roughness={0.3} metalness={0.6} /></mesh>
      <Rod from={lampBaseTop} to={lampElbow} radius={0.038} />
      <mesh position={lampElbow} castShadow><sphereGeometry args={[0.05, 16, 16]} /><meshPhysicalMaterial color="#3a3b40" roughness={0.3} metalness={0.6} /></mesh>
      <Rod from={lampElbow} to={lampNeck} radius={0.03} />
      <mesh position={lampNeck} castShadow><sphereGeometry args={[0.042, 16, 16]} /><meshPhysicalMaterial color="#3a3b40" roughness={0.3} metalness={0.6} /></mesh>
      <group position={lampNeck} rotation={[0.74, 0, -0.5]}>
        <mesh><coneGeometry args={[0.36, 0.45, 32, 1, true]} /><meshPhysicalMaterial color="#17191d" side={THREE.DoubleSide} roughness={0.4} clearcoat={0.2} /></mesh>
        <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#ffdca0" emissive="#ffb35c" emissiveIntensity={2.2} toneMapped={false} /></mesh>
        <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.31, 32]} /><meshBasicMaterial color="#ffd59c" side={THREE.DoubleSide} /></mesh>
        <pointLight ref={lamp} position={[0, -0.3, 0]} color="#ff8a30" intensity={5} distance={4} castShadow />
      </group>
    </group>

    {/* mug: open-topped shell in bisque / slate-white ceramic */}
    <group position={[2.75, 0.12, 1.35]}>
      {/* outer wall, no caps - we build our own floor and rim below */}
      <mesh castShadow><cylinderGeometry args={[0.23, 0.22, 0.38, 24, 1, true]} /><meshPhysicalMaterial color="#e4e7ea" roughness={0.22} clearcoat={0.7} clearcoatRoughness={0.18} /></mesh>
      {/* floor */}
      <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.22, 24]} /><meshPhysicalMaterial color="#e4e7ea" roughness={0.22} clearcoat={0.7} /></mesh>
      {/* inner wall, lit from the inside so it's visible looking down through the opening */}
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.2, 0.195, 0.34, 24, 1, true]} /><meshPhysicalMaterial color="#d6dadf" roughness={0.3} side={THREE.BackSide} /></mesh>
      {/* rim, closes the gap between the outer and inner walls at the top */}
      <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.2, 0.23, 24]} /><meshPhysicalMaterial color="#e4e7ea" roughness={0.22} clearcoat={0.7} side={THREE.DoubleSide} /></mesh>
      {/* coffee surface, sitting inside the cavity below the rim */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19, 24]} /><meshStandardMaterial color="#382013" roughness={0.3} /></mesh>
      {/* handle */}
      <mesh position={[0.25, 0, 0]}><torusGeometry args={[0.14, 0.035, 12, 24]} /><meshPhysicalMaterial color="#e4e7ea" roughness={0.22} clearcoat={0.7} clearcoatRoughness={0.18} /></mesh>
      {/* animated rising steam */}
      <CoffeeSteam animate={animate} />
    </group>

    <ContactShadows position={[0, -0.23, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
  </group>
}

export default function Workstation({ onLoaded }: { onLoaded?: () => void }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { const query = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setAnimate(!query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return <Canvas shadows camera={{ position: [4.1, 3.1, 7.7], fov: 39 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} aria-label="Interactive 3D computer workstation with code, keyboard, plant and desk lamp">
    <ambientLight intensity={1.4} />
    <directionalLight position={[-3, 6, 5]} intensity={2.6} color="#e0e5ff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
    <pointLight position={[2, 2, -3]} intensity={26} color="#ff6c20" />
    <Suspense fallback={<Html center>Loading workstation…</Html>}>
      <Environment preset="city" environmentIntensity={0.35} />
      <Desk animate={animate} onLoaded={onLoaded} />
    </Suspense>
  </Canvas>
}