import fs from "fs"
import path from "path"

export function loadKnowledge() {
  try {
    const filePath = path.join(process.cwd(), "public", "knowledge", "company.txt")
    return fs.readFileSync(filePath, "utf8")
  } catch (err) {
    console.error("Knowledge file not found")
    return ""
  }
}
