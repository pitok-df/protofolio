import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, image: true } },
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        user: { select: { id: true, name: true, image: true } },
                    },
                },
                _count: { select: { replies: true } },
            },
        });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { content, mentionIds = [] } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: session.user.id,
                mentions: {
                    create: mentionIds.map((id: string) => ({ mentionedUserId: id })),
                },
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                replies: { include: { user: { select: { id: true, name: true, image: true } } } },
                _count: { select: { replies: true } },
            },
        });
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
