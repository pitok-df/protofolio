"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    UserCircle,
    Briefcase,
    Code,
    LogOut,
    ChevronLeft,
    Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/profile", icon: UserCircle, label: "Profile" },
    { href: "/admin/skills", icon: Code, label: "Skills" },
    { href: "/admin/projects", icon: Briefcase, label: "Projects" },
];

export default function AdminSidebarClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="flex min-h-screen bg-muted/10 selection:bg-primary/20">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-background border-r border-border/50 shadow-sm">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Admin CMS</h2>
                        <p className="text-xs text-muted-foreground font-medium">Portofolio Manager</p>
                    </div>
                </div>

                <Separator className="opacity-50" />

                <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href} className="block relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="admin-sidebar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}>
                                    <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 mt-auto">
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border/50">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {session?.user?.name?.slice(0, 2).toUpperCase() || "AD"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session?.user?.name || "Admin"}</p>
                                <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ""}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5" asChild>
                                <Link href="/">
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Ke Web
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full text-xs h-8 gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-72 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                            <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">Admin CMS</span>
                    </div>
                    <Link href="/" className="text-xs text-muted-foreground flex items-center gap-1">
                        Ke Web <ChevronLeft className="h-3 w-3 rotate-180" />
                    </Link>
                </header>

                {/* Mobile Navigation (Horizontal scroll) */}
                <nav className="md:hidden sticky top-[53px] z-30 bg-background border-b border-border/50 flex overflow-x-auto hide-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex-1 p-4 md:p-8 lg:px-12 xl:max-w-6xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
