import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.startsWith("/admin")) {

        const cookie = req.cookies.get("admin")

        if (!cookie) {
            return NextResponse.redirect(new URL("/admin/login", req.url))
        }
    }

    return NextResponse.next()
}