import puppeteer from "puppeteer"
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { createServer } from "http"
import { readdirSync, statSync } from "fs"
import { createReadStream } from "fs"
import { extname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")
const distDir = join(rootDir, "dist")

// Find the CSS file in dist/assets
function findAssetFile(extension) {
  const assetsDir = join(distDir, "assets")
  if (!statSync(assetsDir).isDirectory()) return null
  
  const files = readdirSync(assetsDir)
  const file = files.find(f => extname(f) === extension)
  return file ? join(assetsDir, file) : null
}

// Simple HTTP server to serve the built files
function createLocalServer(port = 3000) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(distDir, req.url === "/" ? "index.html" : req.url)
      
      // Handle assets
      if (req.url.startsWith("/assets/")) {
        filePath = join(distDir, req.url)
      }
      
      try {
        if (statSync(filePath).isFile()) {
          const ext = extname(filePath)
          const contentType = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
          }[ext] || "application/octet-stream"
          
          res.writeHead(200, { "Content-Type": contentType })
          createReadStream(filePath).pipe(res)
        } else {
          res.writeHead(404)
          res.end("Not found")
        }
      } catch (err) {
        res.writeHead(404)
        res.end("Not found")
      }
    })
    
    server.listen(port, () => {
      console.log(`Local server running on http://localhost:${port}`)
      resolve(server)
    })
  })
}

async function generateStaticHTML() {
  console.log("Starting static HTML generation...")
  
  // Check if dist directory exists
  try {
    if (!statSync(distDir).isDirectory()) {
      throw new Error("dist directory not found. Please run 'pnpm build' first.")
    }
  } catch (err) {
    throw new Error("dist directory not found. Please run 'pnpm build' first.")
  }
  
  // Start local server
  const server = await createLocalServer(3000)
  
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
    console.log("Loading page...")
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
      timeout: 30000,
    })
    
    // Wait a bit more for any animations or dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Get the rendered HTML - extract body content and remove scripts
    console.log("Extracting HTML...")
    const { bodyHTML, title } = await page.evaluate(() => {
      // Remove all script tags
      const scripts = document.querySelectorAll("script")
      scripts.forEach(script => script.remove())
      
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
    server.close()
  }
}

generateStaticHTML().catch((err) => {
  console.error("Error generating static HTML:", err)
  process.exit(1)
})
