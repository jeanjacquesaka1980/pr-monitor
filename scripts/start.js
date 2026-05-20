#!/usr/bin/env node
// Builds the app and launches Electron detached from the terminal.
// Run: npm run start

const { execSync, spawn } = require('child_process')
const path = require('path')

const root = path.join(__dirname, '..')

console.log('Building…')
execSync('tsc -p tsconfig.main.json', { cwd: root, stdio: 'inherit' })
execSync('vite build', { cwd: root, stdio: 'inherit' })

console.log('Launching PR Monitor…')
const electronPath = require('electron')
const child = spawn(String(electronPath), [root], {
  detached: true,
  stdio: 'ignore',
  cwd: root,
  env: { ...process.env, NODE_ENV: 'production' },
})
child.unref()

console.log('Done. You can close this terminal.')
process.exit(0)
