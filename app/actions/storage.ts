"use server"

import { BUCKETS, minioClient } from "@/lib/minio"

export async function uploadFileAction(formData: FormData, folder: string = "extras") {
  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "No file provided" }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
  const bucketName =
    folder === "platphoto"
      ? BUCKETS.PLATPHOTO
      : folder === "hero"
        ? BUCKETS.HERO
        : folder === "profile-photos"
          ? BUCKETS.PROFILE_PHOTOS
          : BUCKETS.EXTRAS // Default to extras

  try {
    // Upload to MinIO
    await minioClient.putObject(bucketName, filename, buffer, file.size, {
      "Content-Type": file.type,
    })

    // Construct public URL
    // Ensure NEXT_PUBLIC_STORAGE_URL is set in .env
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://116.203.111.206:9000"
    const publicUrl = `${storageUrl}/${bucketName}/${filename}`

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("MinIO upload error:", error)
    return { success: false, error: "Failed to upload file" }
  }
}
