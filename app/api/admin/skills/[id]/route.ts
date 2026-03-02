import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
    const session = await auth();
    const isAdmin =
        (session?.user as any)?.role === "ADMIN" ||
        (session?.user?.email && session.user.email === process.env.ADMIN_EMAIL);

    if (!isAdmin) return null;
    return session;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
    const admin = await requireAdmin();
    const { id } = await params;

    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const updated = await prisma.skill.update({
            where: { id },
            data,
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Gagal update skill" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    const admin = await requireAdmin();
    const { id } = await params;

    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.skill.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal delete skill" }, { status: 500 });
    }
}
