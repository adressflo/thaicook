#!/usr/bin/env node

/**
 * Script pour lancer Next.js dev sans lock file
 * Trouve automatiquement le prochain port disponible à partir de 3000
 */

const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")
const net = require("net")

const lockPath = path.join(__dirname, "..", ".next", "dev", "lock")

// Fonction pour vérifier si un port est disponible
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false) // Port occupé
      } else {
        resolve(false)
      }
    })

    server.once("listening", () => {
      server.close()
      resolve(true) // Port disponible
    })

    server.listen(port)
  })
}

// Fonction pour trouver le prochain port disponible
async function findAvailablePort(startPort = 3000) {
  let port = startPort

  while (true) {
    const available = await isPortAvailable(port)
    if (available) {
      return port
    }
    console.log(`⚠️  Port ${port} occupé, essai du port ${port + 1}...`)
    port++
  }
}

// Fonction pour supprimer le lock
function removeLock() {
  try {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath)
    }
  } catch (error) {
    // Ignore les erreurs
  }
}

// Fonction principale async
async function main() {
  // Supprimer le lock avant de démarrer
  removeLock()

  // Trouver le prochain port disponible
  const port = await findAvailablePort(3000)
  console.log(`🚀 Lancement Next.js sur port ${port} (sans lock)...`)

  // Lancer Next.js
  // Lancer Next.js
  const nextJsPath = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next")
  const nextProcess = spawn(process.execPath, [nextJsPath, "dev", "-p", port.toString()], {
    stdio: "inherit",
    shell: false,
    cwd: path.join(__dirname, ".."),
  })

  // Supprimer le lock toutes les 500ms
  const lockRemover = setInterval(removeLock, 500)

  // Nettoyer à la sortie
  process.on("SIGINT", () => {
    clearInterval(lockRemover)
    removeLock()
    nextProcess.kill("SIGINT")
    process.exit(0)
  })

  process.on("SIGTERM", () => {
    clearInterval(lockRemover)
    removeLock()
    nextProcess.kill("SIGTERM")
    process.exit(0)
  })

  nextProcess.on("exit", (code) => {
    clearInterval(lockRemover)
    removeLock()
    process.exit(code)
  })
}

// Lancer le script
main().catch((error) => {
  console.error("❌ Erreur:", error)
  process.exit(1)
})
