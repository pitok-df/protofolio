import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;

    try {
        const { content, mentionIds = [] } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
        }

        const parentComment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!parentComment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

        const reply = await prisma.commentReply.create({
            data: {
                content: content.trim(),
                commentId,
                userId: session.user.id,
                mentions: {
                    create: mentionIds.map((id: string) => ({ mentionedUserId: id })),
                },
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });
        return NextResponse.json(reply, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;
    const replyId = new URL(req.url).searchParams.get("replyId");
    if (!replyId) return NextResponse.json({ error: "replyId required" }, { status: 400 });

    try {
        const reply = await prisma.commentReply.findUnique({ where: { id: replyId } });
        if (!reply) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const isOwner = reply.userId === session.user.id;
        const isAdmin = (session.user as any).role === "ADMIN";
        if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        await prisma.commentReply.delete({ where: { id: replyId } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
    }
}
