/**
 * Script pour mettre à jour les chemins des médias hero suite à la réorganisation
 * Usage: npx tsx scripts/update-hero-media-paths.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Mise à jour des chemins des médias hero...')

  // Récupérer tous les médias hero
  const allMedias = await prisma.hero_media.findMany()

  console.log(`📋 Trouvé ${allMedias.length} médias à vérifier`)

  let updatedCount = 0

  for (const media of allMedias) {
    let newUrl = media.url

    // Mapping des anciens chemins vers les nouveaux
    if (media.url.startsWith('/videohero/')) {
      newUrl = media.url.replace('/videohero/', '/media/hero/videos/')
      console.log(`  📹 Vidéo: ${media.url} → ${newUrl}`)
    } else if (media.url.startsWith('/videogif/')) {
      newUrl = media.url.replace('/videogif/', '/media/animations/ui/')
      console.log(`  🎬 GIF: ${media.url} → ${newUrl}`)
    } else if (
      media.url.match(/^\/(pourcommander|installapp|pourvosevenement|nous trouver|suivihistorique|apropos|smartphone)\.svg$/)
    ) {
      newUrl = `/illustrations${media.url}`
      console.log(`  🖼️  SVG: ${media.url} → ${newUrl}`)
    } else if (media.url.startsWith('/image avatar/')) {
      newUrl = media.url.replace('/image avatar/', '/media/avatars/')
      console.log(`  👤 Avatar: ${media.url} → ${newUrl}`)
    }

    // Mettre à jour si le chemin a changé
    if (newUrl !== media.url) {
      await prisma.hero_media.update({
        where: { id: media.id },
        data: { url: newUrl },
      })
      updatedCount++
    }
  }

  console.log(`\n✅ ${updatedCount} médias mis à jour avec succès`)

  // Afficher les médias actuels
  const updatedMedias = await prisma.hero_media.findMany({
    where: { active: true },
    orderBy: { ordre: 'asc' },
  })

  console.log('\n📸 Médias actifs dans le Hero Carousel:')
  updatedMedias.forEach((media: any) => {
    console.log(`  ${media.ordre}. ${media.titre} (${media.type}) - ${media.url}`)
  })

  console.log('\n🎉 Mise à jour terminée ! Rafraîchis http://localhost:3000')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la mise à jour:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
