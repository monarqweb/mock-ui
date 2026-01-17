import { readdirSync, statSync } from "fs"
import { join, basename } from "path"

// Helper function to convert filename to title
function filenameToTitle(filename: string): string {
  const name = filename.replace(/\.md$/, "")

  if (name === "index") return "Overview"

  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

type LinkItem = { text: string; link: string }
type GroupItem = { text: string; items: LinkItem[] }
type SidebarItem = LinkItem | GroupItem

function isWhatPage(slug: string) {
  return slug === "what" || slug.startsWith("what-") || slug.startsWith("what_")
}

function sortPages(a: { name: string; text: string }, b: { name: string; text: string }) {
  // 0: index, 1: what*, 2: everything else
  const rank = (name: string) => {
    if (name === "index") return 0
    if (isWhatPage(name)) return 1
    return 2
  }

  const ra = rank(a.name)
  const rb = rank(b.name)
  if (ra !== rb) return ra - rb

  // Stable, human-friendly fallback
  return a.text.localeCompare(b.text)
}

function sortGroups(a: string, b: string) {
  // "introduction" always first
  if (a === "introduction" && b !== "introduction") return -1
  if (b === "introduction" && a !== "introduction") return 1
  return a.localeCompare(b)
}

// Generate sidebar items from folder structure
export function generateSidebarItems(basePath: string): SidebarItem[] {
  const componentsPath = join(process.cwd(), basePath)
  const dirName = basename(basePath)

  // Collect all markdown files recursively (including index.md inside subfolders)
  function collectFiles(
    dirPath: string,
    relativePath: string = ""
  ): Array<{ path: string; relativePath: string; name: string }> {
    const allFiles: Array<{ path: string; relativePath: string; name: string }> = []
    const entries = readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)

      if (entry.isFile() && entry.name.endsWith(".md")) {
        // Skip ONLY the root index.md (handled separately as Overview)
        if (!relativePath && entry.name === "index.md") continue

        const name = entry.name.replace(/\.md$/, "")
        allFiles.push({
          path: fullPath,
          relativePath: relativePath ? `${relativePath}/${name}` : name,
          name,
        })
      } else if (entry.isDirectory()) {
        const subRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        allFiles.push(...collectFiles(fullPath, subRelativePath))
      }
    }

    return allFiles
  }

  const allFiles = collectFiles(componentsPath)

  const items: SidebarItem[] = []
  const rootFiles: Array<{ name: string; text: string; link: string }> = []
  const groupedFiles = new Map<string, Array<{ name: string; text: string; link: string }>>()

  for (const file of allFiles) {
    const pathParts = file.relativePath.split("/")

    if (pathParts.length === 1) {
      rootFiles.push({
        name: file.name,
        text: filenameToTitle(file.name),
        link: `/${dirName}/${file.relativePath}`,
      })
    } else {
      const groupName = pathParts[0]

      if (!groupedFiles.has(groupName)) {
        groupedFiles.set(groupName, [])
      }

      // If this is a subfolder index.md, link to the folder root
      const link =
        file.name === "index"
          ? `/${dirName}/${groupName}/`
          : `/${dirName}/${file.relativePath}`

      groupedFiles.get(groupName)!.push({
        name: file.name,
        text: filenameToTitle(file.name),
        link,
      })
    }
  }

  // Root Overview (index.md at basePath) comes first if it exists
  const indexPath = join(componentsPath, "index.md")
  try {
    if (statSync(indexPath).isFile()) {
      items.push({
        text: "Overview",
        link: `/${dirName}/`,
      })
    }
  } catch {
    // no-op
  }

  // Root-level files: keep alphabetical for now (no special rules requested here)
  rootFiles.sort((a, b) => a.text.localeCompare(b.text))
  items.push(...rootFiles.map(({ text, link }) => ({ text, link })))

  // Grouped files: introduction first, then alphabetical groups
  const sortedGroups = Array.from(groupedFiles.entries()).sort((a, b) => sortGroups(a[0], b[0]))

  for (const [groupName, groupItems] of sortedGroups) {
    // Page ordering: index first, else what*, then alphabetical
    groupItems.sort(sortPages)

    items.push({
      text: filenameToTitle(groupName),
      items: groupItems.map(({ text, link }) => ({ text, link })),
    })
  }

  return items
}
