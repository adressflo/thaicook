import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as Minio from "minio"

// Load environment variables
dotenv.config({ path: ".env" })
dotenv.config({ path: ".env.local" })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or keys")
  process.exit(1)
}

const isServiceKey = SUPABASE_KEY.startsWith("ey") && !SUPABASE_KEY.includes("anon") // Rough check or just trust env
console.log(
  `🔑 Using Key via: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "SUPABASE_SERVICE_ROLE_KEY (Full Access)" : "NEXT_PUBLIC_SUPABASE_ANON_KEY (Public/RLS Restricted)"}`
)

// 1. Initialize Supabase (Source)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 2. Initialize MinIO (Destination)
const minioClient = new Minio.Client({
  endPoint: "116.203.111.206",
  port: 9000,
  useSSL: false,
  accessKey: "admin",
  secretKey: "minioadmin123",
})

const BUCKETS = ["platphoto", "hero", "extras", "profile-photos"]

// Helper to recursively list all files
async function listAllFiles(bucket: string, path = "") {
  const { data, error } = await supabase.storage.from(bucket).list(path)
  if (error) {
    console.warn(`   ⚠️ Error listing ${path} in ${bucket}:`, error.message)
    return []
  }

  let allFiles: any[] = []

  for (const item of data) {
    // Supabase returns folders with id: null
    if (item.id === null) {
      // It's a folder, recurse
      console.log(`   📂 Found folder: ${path}${item.name}`)
      const subFiles = await listAllFiles(bucket, `${path}${item.name}/`)
      allFiles = [...allFiles, ...subFiles]
    } else {
      // It's a file
      if (item.name !== ".emptyFolderPlaceholder") {
        allFiles.push({ ...item, fullPath: `${path}${item.name}` })
      }
    }
  }
  return allFiles
}

async function migrate() {
  console.log("🚀 Starting Migration: Supabase -> MinIO (Hetzner)")
  console.log(`📡 Supabase: ${SUPABASE_URL}`)
  console.log(`💾 MinIO: http://116.203.111.206:9000`)

  for (const bucket of BUCKETS) {
    console.log(`\n📦 Processing bucket: [${bucket}]`)

    // Use recursive list instead of flat list
    const files = await listAllFiles(bucket)

    if (files.length === 0) {
      console.log(`   ℹ️ No files found in ${bucket} (or permission denied)`)
      continue
    }

    console.log(`   found ${files.length} files.`)

    // 2. Transfer each file
    for (const file of files) {
      const fileName = file.fullPath
      console.log(`   ➡️ Transferring: ${fileName}...`)

      try {
        // Download from Supabase
        const { data: blob, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(fileName)

        if (downloadError) throw downloadError

        // Convert Blob to Buffer
        const buffer = Buffer.from(await blob.arrayBuffer())

        // Upload to MinIO
        await minioClient.putObject(bucket, fileName, buffer, blob.size, {
          "Content-Type": blob.type,
        })

        console.log(`      ✅ Uploaded to MinIO`)
      } catch (err: any) {
        console.error(`      ❌ Failed to transfer ${fileName}:`, err.message)
      }
    }
  }

  console.log("\n✨ Migration Complete!")
}

migrate().catch(console.error)
