'use client';
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string | null;
    link?: string | null;
    featured: boolean;
}

const fallbackProjects: Project[] = [
    { id: "1", title: "Pencatatan Pengeluaran", description: "Sistem untuk mencatat pengeluaran dengan dashboard yang mudah dipahami dan fitur analisis keuangan.", tags: ["Next.js", "PostgreSQL", "TypeScript", "Prisma"], imageUrl: "/pencatatan-pengeluaran.png", link: "https://catatan-pengeluaran-three.vercel.app/", featured: true },
    { id: "2", title: "IT Ventory", description: "Aplikasi manajemen inventaris barang dengan fitur pencatatan dan pelacakan yang efisien.", tags: ["Laravel", "MySQL", "Node.js"], imageUrl: "/it-ventory.png", link: "http://it-ventory.kesug.com/", featured: true },
    { id: "3", title: "KMIPN PNP", description: "Platform untuk mengelola partisipasi tim dan proposal dalam Kompetisi Mahasiswa Nasional bidang Informatika.", tags: ["Express.js", "Prisma", "Next.js", "TypeScript", "PostgreSQL"], imageUrl: "/kmipn-pnp.png", link: "https://kmipn.pnp.ac.id/", featured: true },
    { id: "4", title: "Scheduler Course", description: "Aplikasi untuk menjadwalkan mata kuliah dengan fitur manajemen waktu.", tags: ["Express.js", "Prisma", "Next.js", "TypeScript"], imageUrl: "/schedule-project.png", link: "https://schedule-course.vercel.app/schedule", featured: false },
];

export default function ProtofolioSection({ projects }: { projects?: Project[] }) {
    const displayProjects = projects ?? fallbackProjects;

    return (
        <section id="portfolio" className="py-24 bg-muted/20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary text-sm font-medium tracking-widest uppercase">Portfolio</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Projects</h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
                        Beberapa project yang pernah saya kerjakan, dari side project hingga production app.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <Card className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-lg">
                                {/* Image */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Github className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-3">
                                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {project.tags.slice(0, 4).map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs rounded-md px-2 py-0.5">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    {project.link && project.link !== "#" && (
                                        <Button variant="ghost" size="sm" className="w-full mt-1 rounded-md group/btn" asChild>
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                View Project
                                                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
