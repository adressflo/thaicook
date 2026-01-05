-- AlterTable
ALTER TABLE "plats_db" ADD COLUMN     "categorie" VARCHAR(100),
ADD COLUMN     "est_vegetarien" BOOLEAN DEFAULT false,
ADD COLUMN     "niveau_epice" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "idx_plats_vegetarien" ON "plats_db"("est_vegetarien");

-- CreateIndex
CREATE INDEX "idx_plats_niveau_epice" ON "plats_db"("niveau_epice");

-- CreateIndex
CREATE INDEX "idx_plats_categorie" ON "plats_db"("categorie");
