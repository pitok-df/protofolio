import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Middleware/Helper auth khusus admin
async function requireAdmin() {
    const session = await auth();
    const isAdmin =
        (session?.user as any)?.role === "ADMIN" ||
        (session?.user?.email && session.user.email === process.env.ADMIN_EMAIL);

    if (!isAdmin) return null;
    return session;
}

export async function GET() {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const profile = await prisma.profile.findFirst();
        return NextResponse.json(profile || {});
    } catch (error) {
        return NextResponse.json({ error: "Gagal fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();

        // Asumsi hanya ada 1 profil secara sistem, kita insert jika kosong atau update user ke-1.
        const exist = await prisma.profile.findFirst();

        let updated;
        if (exist) {
            updated = await prisma.profile.update({
                where: { id: exist.id },
                data,
            });
        } else {
            updated = await prisma.profile.create({ data });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Gagal update profile" }, { status: 500 });
    }
}
