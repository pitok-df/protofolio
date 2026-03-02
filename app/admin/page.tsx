import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FolderGit2, Code2, MessageSquare, Users, TrendingUp, Presentation, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const [projectsCount, skillsCount, commentsCount, usersCount, featuredCount] = await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.comment.count(),
        prisma.user.count(),
        prisma.project.count({ where: { featured: true } })
    ]);

    const stats = [
        { title: "Total Projects", value: projectsCount, sub: `${featuredCount} Featured`, icon: FolderGit2, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Skills Mastered", value: skillsCount, sub: "Tercatat di DB", icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Komentar Masuk", value: commentsCount, sub: "Diskusi & feedback", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
        { title: "Users Terdaftar", value: usersCount, sub: "Via OAuth", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
                    Monitor statistik utama portofolio Anda. Akses cepat menu di sidebar untuk mengelola konten web secara dinamis dan real-time.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden relative group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground leading-none">
                                            {stat.title}
                                        </p>
                                        <div className="text-3xl font-bold pt-2">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> {stat.sub}
                                        </p>
                                    </div>
                                    <div className={`h - 12 w - 12 rounded - full ${stat.bg} flex items - center justify - center shrink - 0`}>
                                        <Icon className={`h - 6 w - 6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Presentation className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Kelola Showcase</h3>
                                <p className="text-sm text-muted-foreground">Update bio, karya, dan skill</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            CMS Portofolio ini terhubung langsung dengan database Neon. Perubahan yang Anda lakukan pada data Profile, Projects, dan Skills akan secara otomatis diperbarui di halaman utama situs.
                        </p>
                        <div className="flex gap-3">
                            <a href="/admin/profile" className="text-sm font-medium text-primary hover:underline">Edit Profile →</a>
                            <a href="/admin/projects" className="text-sm font-medium text-primary hover:underline">Edit Projects →</a>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <Database className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Stats Database</h3>
                                <p className="text-sm text-muted-foreground">Kondisi sistem saat ini</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">Database Provider</span>
                                <span className="font-medium">Neon Serverless</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-border/40 pb-2">
                                <span className="text-muted-foreground">ORM Framework</span>
                                <span className="font-medium">Prisma v7</span>
                            </li>
                            <li className="flex justify-between items-center pb-2">
                                <span className="text-muted-foreground">Status Interaksi</span>
                                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Aktif & Online
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
