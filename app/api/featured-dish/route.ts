import { NextResponse } from "next/server"
import { getFeaturedDish } from "@/app/actions/restaurant-settings"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const featuredDish = await getFeaturedDish()

    if (!featuredDish) {
      return NextResponse.json(
        { dish: null, message: "Aucun plat vedette défini" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { dish: featuredDish },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in /api/featured-dish:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du plat vedette" },
      { status: 500 }
    )
  }
}
