// export { auth as middleware } from "@/auth"

// import { auth } from "@/auth"

// export default auth((req) => {
//     const publicPaths = ["/", "/login", "/register", "/verifyemail"];
//     const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

//     if (!req.auth && !isPublicPath) {
//         const newUrl = new URL("/login", req.nextUrl.origin);
//         return Response.redirect(newUrl);
//     }
// })

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
    
    const publicPaths = ["/", "/login", "/register", "/verifyemail"];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // const token = request.cookies.get('authjs.session-token')?.value || ''
    // console.log(token);
    const token = request.cookies.getAll().find((c:any) => (c.name.includes("authjs.session-token")))    
    
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}