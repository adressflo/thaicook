export const getStorageUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://116.203.111.206:9000/platphoto"
  // Handle absolute URLs (legacy Supabase)
  if (path.startsWith("http")) return path

  // Clean path: remove leading slashes and prevent double slashes
  const cleanPath = path.replace(/^\/+/, "")

  // If baseUrl already ends with slash, remove it to avoid duplications if cleanPath starts with one (though we just cleaned it)
  // Actually, standardizing on no trailing slash for baseUrl is safer
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  return `${cleanBaseUrl}/${cleanPath}`
}

export const STORAGE_DEFAULTS = {
  EXTRA: "extra.png",
  PLAT: "default-plat.png", // Adjust based on your actual default image name
} as const
