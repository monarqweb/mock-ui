import puppeteer from "puppeteer"
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"
import { readdirSync, statSync } from "fs"
import { extname } from "path"
import { get } from "http"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")
const distDir = join(rootDir, "dist")

// Find the CSS file in dist/assets
function findAssetFile(extension) {
  const assetsDir = join(distDir, "assets")
  if (!statSync(assetsDir).isDirectory()) return null

  const files = readdirSync(assetsDir)
  const file = files.find((f) => extname(f) === extension)
  return file ? join(assetsDir, file) : null
}

// Wait for server to be ready by making a test request
async function waitForServer(port, maxRetries = 30, delay = 500) {
  const url = `http://localhost:${port}`
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = get(url, (res) => {
          res.on("data", () => {})
          res.on("end", () => {
            if (res.statusCode === 200 || res.statusCode === 404) {
              resolve()
            } else {
              reject(new Error(`Server returned status ${res.statusCode}`))
            }
          })
        })
        req.on("error", (err) => {
          reject(err)
        })
        req.setTimeout(1000, () => {
          req.destroy()
          reject(new Error("Request timeout"))
        })
      })
      return true
    } catch (err) {
      // Server not ready yet, wait and retry
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw new Error(
    `Server at ${url} did not become ready after ${maxRetries} attempts`
  )
}

// Start vite preview and extract the port from output
function startVitePreview() {
  return new Promise((resolve, reject) => {
    console.log("Starting vite preview server...")

    // Use pnpm to run vite preview (respects packageManager setting)
    const viteProcess = spawn("pnpm", ["preview", "--host"], {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    })

    let port = null
    let outputBuffer = ""

    const extractPort = (data) => {
      outputBuffer += data.toString()
      // Vite preview outputs: "  ➜  Local:   http://localhost:4173/"
      // or "  ➜  Network: use --host to expose"
      // Look for "Local:" or "localhost:" followed by port
      const portMatch =
        outputBuffer.match(/localhost:(\d+)/i) ||
        outputBuffer.match(/Local:\s*http:\/\/[^:]+:(\d+)/i) ||
        outputBuffer.match(/:\/\/localhost:(\d+)/i)

      if (portMatch && !port) {
        port = parseInt(portMatch[1], 10)
        console.log(`✓ Vite preview server started on port ${port}`)
        resolve({ process: viteProcess, port })
      }
    }

    viteProcess.stdout.on("data", extractPort)
    viteProcess.stderr.on("data", extractPort)

    viteProcess.on("error", (err) => {
      reject(new Error(`Failed to start vite preview: ${err.message}`))
    })

    viteProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Vite preview exited with code ${code}`))
      }
    })

    // Timeout if we can't find the port
    setTimeout(() => {
      if (!port) {
        viteProcess.kill()
        reject(new Error("Could not determine port from vite preview output"))
      }
    }, 10000)
  })
}

async function generateStaticHTML() {
  console.log("Starting static HTML generation...")

  // Check if dist directory exists
  try {
    if (!statSync(distDir).isDirectory()) {
      throw new Error(
        "dist directory not found. Please run 'pnpm build' first."
      )
    }
  } catch (err) {
    throw new Error("dist directory not found. Please run 'pnpm build' first.")
  }

  // Start vite preview server
  const { process: viteProcess, port } = await startVitePreview()

  // Wait for server to be ready
  console.log("Waiting for server to be ready...")
  await waitForServer(port)
  const serverUrl = `http://localhost:${port}`
  console.log(`✓ Server is ready at ${serverUrl}`)

  try {
    // Launch browser
    console.log("Launching browser...")
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 })

    // Navigate to the built app
    console.log(`Loading page from ${serverUrl}...`)
    await page.goto(serverUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    // Wait a bit more for any animations or dynamic content
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get the rendered HTML - extract body content and remove scripts
    console.log("Extracting HTML...")
    const { bodyHTML, title } = await page.evaluate(() => {
      // Remove all script tags
      const scripts = document.querySelectorAll("script")
      scripts.forEach((script) => script.remove())

      // Get body content
      const body = document.body
      const bodyHTML = body.innerHTML

      // Get title
      const title = document.title || "Static HTML Export"

      return { bodyHTML, title }
    })

    // Get the CSS content
    const cssPath = findAssetFile(".css")
    let cssContent = ""
    if (cssPath) {
      cssContent = readFileSync(cssPath, "utf-8")
    }

    // Create self-contained HTML
    const staticHTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
${cssContent}
    </style>
  </head>
  <body>
${bodyHTML}
  </body>
</html>`

    // Write the static HTML file
    const outputPath = join(distDir, "static.html")
    writeFileSync(outputPath, staticHTML, "utf-8")

    console.log(`✅ Static HTML generated: ${outputPath}`)
    console.log(`   File size: ${(staticHTML.length / 1024).toFixed(2)} KB`)

    await browser.close()
  } finally {
    // Kill the vite preview process
    console.log("Stopping vite preview server...")
    viteProcess.kill()
    // Wait a bit for the process to clean up
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

generateStaticHTML().catch((err) => {
  console.error("Error generating static HTML:", err)
  process.exit(1)
})
