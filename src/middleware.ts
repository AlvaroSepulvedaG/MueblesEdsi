import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define las rutas protegidas usando un patrón más amplio
export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  // Verifica si la ruta contiene "comenunca" en cualquier parte
  const isComenuncaRoute = req.nextUrl.pathname.includes('/comenunca');

  // Si el usuario no está autenticado y está en una ruta protegida
  if (isComenuncaRoute && !userId) {
    // Redirige a la página de inicio de sesión personalizada
    const signInUrl = new URL('/login', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Permite el acceso si el usuario está autenticado o si no está en una ruta protegida
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Ignorar rutas internas de Next.js y archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta para rutas API
    '/(api|trpc)(.*)',
  ],
};