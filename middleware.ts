import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const protectedRoutes = {
  "/articles": ["User", "Admin"],
  "/admin": ["Admin"],
};

const publicRoutes = ["/login", "/register", "/", "/unauthorized"];

function getRequiredRoles(pathname: string): string[] | null {
  if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
    return protectedRoutes[pathname as keyof typeof protectedRoutes];
  }

  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return roles;
    }
  }

  return null;
}

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let userRole = decoded.role;

    if (!userRole && decoded.userId) {
      userRole =
        decoded.userId === 1 || decoded.userId === "1" ? "Admin" : "User";
    }

    if (!userRole || !requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
