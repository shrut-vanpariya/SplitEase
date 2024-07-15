// export { auth as middleware } from "@/auth"

import { auth } from "@/auth"

export default auth((req) => {
    const publicPaths = ["/", "/login", "/register", "/verifyemail"];
    const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

    if (!req.auth && !isPublicPath) {
        const newUrl = new URL("/login", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}