"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { CommentForm } from "./comment-form";

interface User { id: string; name: string | null; image: string | null; }
interface CommentReply { id: string; content: string; user: User; createdAt: string; }
interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
    replies: CommentReply[];
    _count?: { replies: number };
}

function renderContent(text: string) {
    const parts = text.split(/(@\w[\w\s]*\b)/g);
    return parts.map((part, i) =>
        part.startsWith("@") ? (
            <span key={i} className="text-primary font-medium">{part}</span>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

function TimeAgo({ date }: { date: string }) {
    return (
        <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })}
        </span>
    );
}

export function CommentItem({
    comment,
    onDelete,
    onReply,
}: {
    comment: Comment;
    onDelete: (id: string) => void;
    onReply: (commentId: string, content: string, mentionIds: string[]) => Promise<void>;
}) {
    const { data: session } = useSession();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = session?.user?.id === comment.user.id;
    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const canDelete = isOwner || isAdmin;
    const replyCount = comment._count?.replies ?? comment.replies.length;

    const handleDelete = async () => {
        if (!confirm("Hapus komentar ini?")) return;
        setDeleting(true);
        try {
            await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
            onDelete(comment.id);
        } catch { } finally { setDeleting(false); }
    };

    const handleReply = async (content: string, mentionIds: string[]) => {
        await onReply(comment.id, content, mentionIds);
        setShowReplyForm(false);
        setShowReplies(true);
    };

    const initials = (name: string | null) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex gap-3"
        >
            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                <AvatarImage src={comment.user.image ?? ""} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {initials(comment.user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1.5">
                {/* Comment bubble */}
                <div className="bg-muted/50 border border-border/40 rounded-lg px-4 py-3 space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{comment.user.name}</span>
                            <TimeAgo date={comment.createdAt} />
                        </div>
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed">{renderContent(comment.content)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pl-1">
                    {session && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <Reply className="h-3.5 w-3.5" />
                            Balas
                        </button>
                    )}
                    {replyCount > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            {showReplies ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {replyCount} balasan
                        </button>
                    )}
                </div>

                {/* Reply form */}
                <AnimatePresence>
                    {showReplyForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 border-l-2 border-primary/20"
                        >
                            <CommentForm
                                onSubmit={handleReply}
                                placeholder={`Balas ke ${comment.user.name}...`}
                                compact
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Replies */}
                <AnimatePresence>
                    {showReplies && comment.replies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="pl-4 border-l-2 border-border/40 space-y-3 mt-2"
                        >
                            {comment.replies.map(reply => (
                                <div key={reply.id} className="flex gap-2.5">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarImage src={reply.user.image ?? ""} />
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                            {initials(reply.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-muted/40 border border-border/30 rounded-lg px-3 py-2 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold">{reply.user.name}</span>
                                            <TimeAgo date={reply.createdAt} />
                                        </div>
                                        <p className="text-sm leading-relaxed">{renderContent(reply.content)}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
