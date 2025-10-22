'use server'

// Configuration ISR pour les données de menu
export async function getPlatsWithISR() {
  const { data: plats, error } = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/plats`,
    {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      next: { 
        revalidate: 3600 // Revalidation toutes les heures
      }
    }
  ).then(res => res.json())
  
  return plats || []
}

// Configuration pour les données statiques (À propos, Contact)
export async function getStaticContent() {
  return {
    restaurantInfo: {
      name: "ChanthanaThaiCook",
      description: "Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande",
      phone: "07 49 28 37 07",
      location: "Marigny-Marmande",
      hours: "18h00 - 20h30"
    }
  }
}