/**
 * Script de seed pour ajouter des médias de test au Hero Carousel
 * Usage: npx tsx scripts/seed-hero-media.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed Hero Media - Démarrage...')

  // Supprimer les médias existants (nettoyage)
  await prisma.hero_media.deleteMany()
  console.log('✅ Nettoyage des médias existants')

  // Créer 3 médias de test utilisant les images existantes dans public/
  const heroMedias = await prisma.hero_media.createMany({
    data: [
      {
        id: 'hero-1',
        type: 'image',
        url: '/pourcommander.svg',
        titre: 'Découvrez Notre Menu',
        description: 'Cuisine Thaïlandaise Authentique',
        ordre: 1,
        active: true,
      },
      {
        id: 'hero-2',
        type: 'image',
        url: '/pourvosevenement.svg',
        titre: 'Pour Vos Événements',
        description: 'Organisez des moments inoubliables',
        ordre: 2,
        active: true,
      },
      {
        id: 'hero-3',
        type: 'image',
        url: '/nous trouver.svg',
        titre: 'Nous Trouver',
        description: 'Venez nous rendre visite à Marigny-Marmande',
        ordre: 3,
        active: true,
      },
    ],
  })

  console.log(`✅ ${heroMedias.count} médias créés avec succès`)

  // Vérifier les médias créés
  const allMedias = await prisma.hero_media.findMany({
    where: { active: true },
    orderBy: { ordre: 'asc' },
  })

  console.log('\n📸 Médias actifs dans le Hero Carousel:')
  allMedias.forEach((media: any) => {
    console.log(`  ${media.ordre}. ${media.titre} (${media.type}) - ${media.url}`)
  })

  console.log('\n🎉 Seed terminé ! Rafraîchis http://localhost:3000 pour voir le carousel.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
