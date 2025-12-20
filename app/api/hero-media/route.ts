import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const medias = await prisma.hero_media.findMany({
      where: { active: true },
      orderBy: { ordre: "asc" },
      select: {
        id: true,
        type: true,
        url: true,
        titre: true,
        description: true,
        ordre: true,
        active: true,
      },
    })

    return NextResponse.json(medias)
  } catch (error) {
    console.error("Erreur chargement hero_media:", error)
    return NextResponse.json([], { status: 500 })
  }
}
