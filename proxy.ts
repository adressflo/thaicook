import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas de vérification)
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/reset-password"];
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Vérifier présence du cookie de session Better Auth
  // Note: Vérification légère (Edge Runtime compatible)
  // La vraie vérification de session se fait dans les Server Components
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Routes nécessitant authentification client
  const authRequiredRoutes = [
    "/profil",
    "/commander",
    "/panier",
    "/historique",
    "/suivi",
    "/evenements",
    "/modifier-commande",
    "/modifier-evenement",
    "/suivi-commande",
    "/suivi-evenement",
  ];

  if (authRequiredRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Routes admin nécessitant authentification
  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // TODO: Vérifier rôle admin côté Server Component
    // Le middleware vérifie juste la présence de session (Edge Runtime)
    // La vérification du rôle se fait dans les composants AdminRoute
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclure API routes, static files, images
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
