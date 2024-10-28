import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession, useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest){

    const token = await getToken({req: request});

    if(!token){
      if (request.nextUrl.pathname !== '/login') {
          const url = request.nextUrl.clone();
          url.pathname = '/login';
          return NextResponse.redirect(url);
      }
      return NextResponse.next();
  }

    switch (token.role) {
        case "admin":
          if (!request.nextUrl.pathname.startsWith("/menu_admin")&&
          !request.nextUrl.pathname.startsWith("/create_user")&&
          !request.nextUrl.pathname.startsWith("/ver_entrenadores")&&
          !request.nextUrl.pathname.startsWith("/create_cliente")) {
            return NextResponse.redirect(new URL("/menu_admin", request.url));
          }
          if(request.nextUrl.pathname.startsWith("/login")){
            return NextResponse.redirect(new URL("/menu_admin", request.url));
          }
          break;
        case "trainer":
          if (
            request.nextUrl.pathname !== "/" &&
            !request.nextUrl.pathname.startsWith("/edit_rutina2") &&
            !request.nextUrl.pathname.startsWith("/historial")
          ) {
            return NextResponse.redirect(new URL("/", request.url));
          }
          if(request.nextUrl.pathname.startsWith("/login")){
            return NextResponse.redirect(new URL("/", request.url));
          }
          break;
        default:
          return NextResponse.redirect(new URL("/login", request.url));
      }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)']
}