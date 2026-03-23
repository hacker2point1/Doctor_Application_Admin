import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // 1. If token NOT found
  if (!token) {
    // 2. Create new redirect URL
    const url = new URL("/auth/signIn", request.url);

    // 3. Attach query param
    url.searchParams.set("message", "login_required");

    // 4. Redirect to: /auth/signIn?message=login_required
    return NextResponse.redirect(url);
  }

  // 5. If token exists → allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/doctorCRUD/createDoctor", 
    "/doctorCRUD/departmentId", 
    "/doctorCRUD/departmentList",
    "/doctorCRUD/doctorList",
    "/doctorCRUD/manageAppoinment",
    "/doctorCRUD/acceptedAppoinments",
    "/dashboard",
    "/auth/profile"
  ],
};
