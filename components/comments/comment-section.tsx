"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Loader2 } from "lucide-react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface User { id: string; name: string | null; image: string | null; }
interface Reply { id: string; content: string; user: User; createdAt: string; }
interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
    replies: Reply[];
    _count?: { replies: number };
}

export function CommentSection() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const res = await fetch("/api/comments");
            const data = await res.json();
            setComments(data);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComments(); }, []);

    const handlePost = async (content: string, mentionIds: string[]) => {
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, mentionIds }),
        });
        if (!res.ok) throw new Error("Failed to post");
        const newComment = await res.json();
        setComments(prev => [newComment, ...prev]);
    };

    const handleReply = async (commentId: string, content: string, mentionIds: string[]) => {
        const res = await fetch(`/api/comments/${commentId}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, mentionIds }),
        });
        if (!res.ok) throw new Error("Failed to post reply");
        const newReply = await res.json();
        setComments(prev =>
            prev.map(c =>
                c.id === commentId
                    ? { ...c, replies: [...c.replies, newReply], _count: { replies: (c._count?.replies ?? 0) + 1 } }
                    : c
            )
        );
    };

    const handleDelete = (id: string) => {
        setComments(prev => prev.filter(c => c.id !== id));
    };

    return (
        <section id="comments" className="py-24 bg-muted/20">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <div className="text-center mb-2">
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">Komunitas</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 flex items-center justify-center gap-3">
                            <MessageCircle className="h-7 w-7 text-primary" />
                            Komentar
                        </h2>
                    </div>
                    <p className="text-center text-muted-foreground text-sm mt-2">
                        {comments.length > 0 ? `${comments.length} komentar` : "Jadilah yang pertama berkomentar!"}
                    </p>
                </motion.div>

                {/* Post Form */}
                <div className="mb-8">
                    <CommentForm onSubmit={handlePost} />
                </div>

                {/* Comments List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Belum ada komentar. Mulai diskusi!</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-6">
                            {comments.map(comment => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    onDelete={handleDelete}
                                    onReply={handleReply}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
