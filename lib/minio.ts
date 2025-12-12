import * as Minio from "minio"

const endPoint = process.env.MINIO_ENDPOINT || "116.203.111.206"
const port = parseInt(process.env.MINIO_PORT || "9000", 10)
const accessKey = process.env.MINIO_ACCESS_KEY || "admin"
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin123"
const useSSL = process.env.MINIO_USE_SSL === "true"

export const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey,
  secretKey,
})

export const BUCKETS = {
  PLATPHOTO: "platphoto",
  HERO: "hero",
  EXTRAS: "extras",
  PROFILE_PHOTOS: "profile-photos",
}
