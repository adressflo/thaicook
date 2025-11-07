-- AlterTable (Drift resolution: deleted_at column)
ALTER TABLE "client_db" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

-- CreateTable hero_media
CREATE TABLE "hero_media" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "titre" TEXT,
    "description" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_hero_media_ordre_active" ON "hero_media"("ordre", "active");
