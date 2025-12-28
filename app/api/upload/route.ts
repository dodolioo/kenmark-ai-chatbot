import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<any>(sheet)

    const knowledgeText = rows
      .map(r => `Category: ${r.Category}\nQ: ${r.Question}\nA: ${r.Answer}\n`)
      .join("\n")

    const knowledgeDir = path.join(process.cwd(), "public", "knowledge")
    fs.mkdirSync(knowledgeDir, { recursive: true })

    fs.writeFileSync(path.join(knowledgeDir, "company.txt"), knowledgeText)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("UPLOAD ERROR:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
