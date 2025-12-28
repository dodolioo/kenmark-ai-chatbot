"use client"
import { useState } from "react"

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")

  async function uploadFile() {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      setStatus("Knowledge updated successfully")
    } else {
      setStatus("Upload failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">
          Admin Knowledge Panel
        </h1>

        <div className="space-y-4">
          <label className="block text-gray-300 text-sm">
            Upload Knowledge (Excel .xlsx)
          </label>

          {/* Custom File Picker */}
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition">
              Choose File
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <span className="text-gray-300 text-sm truncate">
              {file ? file.name : "No file selected"}
            </span>
          </div>

          <button
            onClick={uploadFile}
            disabled={!file}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition rounded-lg text-white font-semibold"
          >
            Upload Knowledge
          </button>

          {status && (
            <p
              className={`text-center text-sm ${
                status.includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
