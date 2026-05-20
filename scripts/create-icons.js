#!/usr/bin/env node
// Generates tray-icon.png (22x22 template) and icon.png (1024x1024) using only Node.js built-ins.
// Run: node scripts/create-icons.js

const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// --- Minimal PNG encoder ---

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBytes = Buffer.alloc(4)
  crcBytes.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([len, typeBytes, data, crcBytes])
}

function encodePNG(width, height, getPixel) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type: RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const rawRows = []
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4)
    row[0] = 0 // filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y)
      row[1 + x * 4 + 0] = r
      row[1 + x * 4 + 1] = g
      row[1 + x * 4 + 2] = b
      row[1 + x * 4 + 3] = a
    }
    rawRows.push(row)
  }

  const compressed = zlib.deflateSync(Buffer.concat(rawRows))

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// --- Ghost shape renderer (SVG viewBox 0 0 100 100) ---
// All coordinates in [0,100] space.

function quadBezierAt(t, p0, p1, p2) {
  return (1 - t) ** 2 * p0 + 2 * t * (1 - t) * p1 + t ** 2 * p2
}

function solveQuadBezierT(px, x0, x1, x2) {
  const a = x2 - 2 * x1 + x0
  const b = 2 * (x1 - x0)
  const c = x0 - px
  if (Math.abs(a) < 0.001) {
    if (Math.abs(b) < 0.001) return null
    const t = -c / b
    return t >= 0 && t <= 1 ? t : null
  }
  const disc = b * b - 4 * a * c
  if (disc < 0) return null
  const t1 = (-b + Math.sqrt(disc)) / (2 * a)
  const t2 = (-b - Math.sqrt(disc)) / (2 * a)
  if (t1 >= 0 && t1 <= 1) return t1
  if (t2 >= 0 && t2 <= 1) return t2
  return null
}

// Returns 'body' | 'eye' | 'mouth' | 'tongue' | null
function ghostRegion(px, py) {
  // --- Ghost body ---
  // Top semicircle: center (50,48), radius 35, upper half only
  const inHead = (px - 50) ** 2 + (py - 48) ** 2 < 35 ** 2 && py <= 48
  // Body rect
  const inBodyRect = px > 15 && px < 85 && py > 48 && py < 78
  // Scallop bumps (3 quadratic bezier arcs below y=78)
  let inScallop = false
  if (py >= 78) {
    const segs = [
      [85, 78, 73, 88, 62, 78],
      [62, 78, 50, 88, 38, 78],
      [38, 78, 27, 88, 15, 78],
    ]
    for (const [x0, y0, x1, y1, x2, y2] of segs) {
      const minX = Math.min(x0, x2)
      const maxX = Math.max(x0, x2)
      if (px < minX || px > maxX) continue
      const t = solveQuadBezierT(px, x0, x1, x2)
      if (t === null) continue
      if (py <= quadBezierAt(t, y0, y1, y2)) { inScallop = true; break }
    }
  }
  const inGhost = inHead || inBodyRect || inScallop
  if (!inGhost) return null

  // --- Tongue (drawn on top, pink) ---
  if ((px - 50) ** 2 / 49 + (py - 68) ** 2 / 30.25 < 1) return 'tongue'

  // --- Mouth fill ---
  // Path: M 33 58 L 67 58 Q 50 72 33 58 Z  (filled crescent below y=58)
  if (py >= 58 && px >= 33 && px <= 67) {
    // Check if below the bezier bottom edge
    const t = solveQuadBezierT(px, 33, 50, 67)
    if (t !== null) {
      const curveY = quadBezierAt(t, 58, 72, 58)
      if (py <= curveY) return 'mouth'
    }
  }

  // --- Eyes ---
  if ((px - 36) ** 2 / 30.25 + (py - 42) ** 2 / 42.25 < 1) return 'eye'
  if ((px - 64) ** 2 / 30.25 + (py - 42) ** 2 / 42.25 < 1) return 'eye'

  return 'body'
}

// Tray icon: 22x22, white ghost on transparent
function makeTrayIcon() {
  return encodePNG(22, 22, (x, y) => {
    const px = (x / 21) * 100
    const py = (y / 21) * 100
    const region = ghostRegion(px, py)
    if (!region) return [0, 0, 0, 0]
    if (region === 'tongue') return [255, 123, 123, 255]
    if (region === 'eye' || region === 'mouth') return [13, 17, 23, 220]
    return [255, 255, 255, 255] // body
  })
}

// App icon: 1024x1024, ghost on dark rounded-square background
function makeAppIcon() {
  return encodePNG(1024, 1024, (x, y) => {
    const nx = x / 1023
    const ny = y / 1023
    // Rounded square background
    const cx = nx - 0.5
    const cy = ny - 0.5
    const r = 0.18
    const hw = 0.5
    const inRoundedSquare =
      Math.abs(cx) < hw && Math.abs(cy) < hw &&
      !(Math.abs(cx) > hw - r && Math.abs(cy) > hw - r &&
        (Math.abs(cx) - hw + r) ** 2 + (Math.abs(cy) - hw + r) ** 2 > r * r)

    if (!inRoundedSquare) return [0, 0, 0, 0]

    const px = nx * 100
    const py = ny * 100
    const region = ghostRegion(px, py)
    if (!region) return [13, 17, 23, 255]       // dark bg: #0d1117
    if (region === 'tongue') return [255, 123, 123, 255]
    if (region === 'eye' || region === 'mouth') return [13, 17, 23, 255]
    return [255, 255, 255, 255]                  // white ghost body
  })
}

const assetsDir = path.join(__dirname, '..', 'assets')
fs.mkdirSync(assetsDir, { recursive: true })

console.log('Generating tray-icon.png (22x22)…')
fs.writeFileSync(path.join(assetsDir, 'tray-icon.png'), makeTrayIcon())

console.log('Generating icon.png (1024x1024)…')
fs.writeFileSync(path.join(assetsDir, 'icon.png'), makeAppIcon())

// Generate ICNS using macOS iconutil (required for .dmg packaging)
const { execSync } = require('child_process')
const iconset = path.join(assetsDir, 'icon.iconset')
fs.mkdirSync(iconset, { recursive: true })

const sizes = [16, 32, 64, 128, 256, 512, 1024]
const sipsAvailable = (() => { try { execSync('which sips', { stdio: 'ignore' }); return true } catch { return false } })()

if (sipsAvailable) {
  console.log('Generating iconset with sips…')
  for (const s of sizes) {
    execSync(`sips -z ${s} ${s} "${path.join(assetsDir, 'icon.png')}" --out "${path.join(iconset, `icon_${s}x${s}.png`)}"`, { stdio: 'ignore' })
    if (s <= 512) {
      execSync(`sips -z ${s * 2} ${s * 2} "${path.join(assetsDir, 'icon.png')}" --out "${path.join(iconset, `icon_${s}x${s}@2x.png`)}"`, { stdio: 'ignore' })
    }
  }
  execSync(`iconutil -c icns "${iconset}" -o "${path.join(assetsDir, 'icon.icns')}"`)
  fs.rmSync(iconset, { recursive: true })
  console.log('Generated icon.icns')
} else {
  console.log('sips not found — skipping ICNS generation (only needed for npm run dist)')
}

console.log('Done.')
