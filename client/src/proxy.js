import { NextResponse } from "next/server";

export function proxy(request) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;

    let user = null;
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);
        } catch (error) {
            console.error(error);
        }
    }

    const isPublicPath = pathname === "/login" || pathname === "/register";

    if (isPublicPath && token && user) {
        if (user.role === "admin")
            return NextResponse.redirect(new URL("/admin", request.url));
        if (user.role === "petugas")
            return NextResponse.redirect(new URL("/petugas", request.url));
        return NextResponse.redirect(new URL("/peminjam", request.url));
    }

    const isProtectedPath =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/petugas") ||
        pathname.startsWith("/peminjam");

    if (isProtectedPath && (!token || !user)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && user) {
        if (pathname.startsWith("/admin") && user.role !== "admin") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (pathname.startsWith("/petugas") && user.role !== "petugas") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (pathname.startsWith("/peminjam") && user.role !== "peminjam") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/admin/:path*",
        "/petugas/:path*",
        "/peminjam/:path*",
    ],
};
