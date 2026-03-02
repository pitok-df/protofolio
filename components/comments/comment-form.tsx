"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Send, AtSign } from "lucide-react";

interface MentionUser {
    id: string;
    name: string | null;
    image: string | null;
}

interface CommentFormProps {
    onSubmit: (content: string, mentionIds: string[]) => Promise<void>;
    placeholder?: string;
    compact?: boolean;
}

export function CommentForm({ onSubmit, placeholder = "Tulis komentar...", compact = false }: CommentFormProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
    const [selectedMentions, setSelectedMentions] = useState<MentionUser[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Search for users when @ is typed
    useEffect(() => {
        if (mentionQuery === null) {
            setShowDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            if (mentionQuery.length >= 0) {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}`);
                const users = await res.json();
                setMentionUsers(users);
                setShowDropdown(users.length > 0);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [mentionQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);

        // Detect @mention
        const cursorPos = e.target.selectionStart;
        const textUpToCursor = val.slice(0, cursorPos);
        const mentionMatch = textUpToCursor.match(/@(\w*)$/);
        if (mentionMatch) {
            setMentionQuery(mentionMatch[1]);
        } else {
            setMentionQuery(null);
            setShowDropdown(false);
        }
    };

    const insertMention = (user: MentionUser) => {
        if (!textareaRef.current) return;
        const cursorPos = textareaRef.current.selectionStart;
        const textUpToCursor = content.slice(0, cursorPos);
        const textAfterCursor = content.slice(cursorPos);
        const newText = textUpToCursor.replace(/@(\w*)$/, `@${user.name} `) + textAfterCursor;
        setContent(newText);
        setSelectedMentions(prev => [...prev.filter(m => m.id !== user.id), user]);
        setShowDropdown(false);
        setMentionQuery(null);
        textareaRef.current.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || loading) return;
        setLoading(true);
        try {
            await onSubmit(content, selectedMentions.map(m => m.id));
            setContent("");
            setSelectedMentions([]);
        } catch { } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="bg-muted/30 border border-border/50 rounded-lg p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">Login untuk ikut berkomentar</p>
                <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" className="gap-2 rounded-md" onClick={() => signIn("github")}>
                        <Github className="h-4 w-4" /> GitHub
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 rounded-md" onClick={() => signIn("google")}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Google
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-3 items-start">
                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {session.user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleChange}
                        placeholder={placeholder}
                        rows={compact ? 2 : 3}
                        className="w-full resize-none rounded-md border border-border/60 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    />

                    {/* @mention dropdown */}
                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute z-50 top-full mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                            {mentionUsers.map(user => (
                                <button
                                    key={user.id}
                                    type="button"
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                                    onClick={() => insertMention(user)}
                                >
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={user.image ?? ""} />
                                        <AvatarFallback className="text-xs">{user.name?.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">{user.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AtSign className="h-3 w-3" /> untuk mention
                        </p>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!content.trim() || loading}
                            className="rounded-md gap-2"
                        >
                            <Send className="h-3.5 w-3.5" />
                            {loading ? "Mengirim..." : "Kirim"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
