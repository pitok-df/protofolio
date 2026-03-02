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

export async function GET() {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const skills = await prisma.skill.findMany({
            orderBy: [
                { category: "asc" },
                { order: "asc" }
            ]
        });
        return NextResponse.json(skills);
    } catch (error) {
        return NextResponse.json({ error: "Gagal fetch skills" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const newSkill = await prisma.skill.create({ data });
        return NextResponse.json(newSkill, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Gagal membuat skill" }, { status: 500 });
    }
}
