import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const q = new URL(req.url).searchParams.get("q") ?? "";
    if (!q || q.length < 1) return NextResponse.json([]);

    try {
        const users = await prisma.user.findMany({
            where: {
                name: { contains: q, mode: "insensitive" },
            },
            select: { id: true, name: true, image: true },
            take: 8,
        });
        return NextResponse.json(users);
    } catch {
        return NextResponse.json([]);
    }
}
