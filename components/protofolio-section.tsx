import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const projects = [
    {
        title: "Pencatatan Pengeluaran",
        description: "Sistem untuk mencatat pengeluaran dengan dashboard yang mudah dipahami dan fitur analisis keuangan.",
        tags: ["Next.js", "PostgreSQL", "TypeScript", "Prisma"],
        image: "/pencatatan-pengeluaran.png",
        link: "https://catatan-pengeluaran-three.vercel.app/"
    },
    {
        title: "IT Ventory",
        description: "Aplikasi manajemen inventaris barang dengan fitur pencatatan dan pelacakan yang efisien.",
        tags: ["Laravel", "MySQL", "Node.js"],
        image: "/it-ventory.png",
        link: "http://it-ventory.kesug.com/"
    },
    {
        title: "KMIPN PNP",
        description: "Platform untuk mengelola partisipasi tim dan proposal dalam Kompetisi Mahasiswa Nasional bidang Informatika.",
        tags: ["Express.js", "Prisma", "Next.js", "TypeScript", "PostgreSQL"],
        image: "/kmipn-pnp.png",
        link: "https://kmipn.pnp.ac.id/"
    },
    {
        title: "Scheduler Course",
        description: "Aplikasi untuk menjadwalkan mata kuliah dengan fitur manajemen waktu.",
        tags: ["Express.js", "Prisma", "Next.js", "TypeScript", "PostgreSQL"],
        image: "/schedule-project.png",
        link: "https://schedule-course.vercel.app/schedule"
    },
    {
        title: "Coming Soon...",
        description: "Coming soon...",
        tags: ["Coming Soon..."],
        image: "/coming-soon.png",
        link: "#"
    }
];

export default function ProtofolioSection() {
    return (
        <section id="portfolio" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Featured Projects</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="group overflow-hidden">
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full group/btn">
                                        <a href={project.link} target="_blank" className="flex">
                                            View Project
                                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
