'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Triangle, FileText, Server, Database, Zap, Shield, GitBranch, Palette, Layers, Box, Gitlab, Send, Code } from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    description?: string | null;
    iconColor?: string | null;
}

const iconMap: Record<string, any> = {
    React: Code2, "Next.js": Triangle, TypeScript: FileText, "Node.js": Server,
    "Express.js": Layers, Prisma: Zap, PostgreSQL: Database, JWT: Shield,
    Git: GitBranch, Docker: Box, GitLab: Gitlab, Postman: Send, VSCode: Code,
    "Tailwind CSS": Palette,
};

const fallbackSkills: Skill[] = [
    { id: "1", name: "React", category: "Frontend", level: 85, description: "Building interactive UIs", iconColor: "from-blue-400 to-blue-600" },
    { id: "2", name: "Next.js", category: "Framework", level: 82, description: "Full-stack React framework", iconColor: "from-gray-600 to-gray-900" },
    { id: "3", name: "TypeScript", category: "Language", level: 80, description: "Type-safe JavaScript", iconColor: "from-blue-500 to-blue-700" },
    { id: "4", name: "Node.js", category: "Backend", level: 78, description: "Server-side JavaScript", iconColor: "from-green-500 to-green-700" },
    { id: "5", name: "Express.js", category: "Backend", level: 75, description: "Web framework for Node.js", iconColor: "from-gray-500 to-gray-800" },
    { id: "6", name: "Prisma", category: "ORM", level: 80, description: "Next-gen ORM", iconColor: "from-indigo-500 to-purple-600" },
    { id: "7", name: "PostgreSQL", category: "Database", level: 75, description: "Relational database", iconColor: "from-blue-600 to-indigo-600" },
    { id: "8", name: "Git", category: "Tools", level: 85, description: "Version control system", iconColor: "from-orange-500 to-red-600" },
    { id: "9", name: "Tailwind CSS", category: "Styling", level: 88, description: "Utility-first CSS", iconColor: "from-cyan-400 to-blue-500" },
    { id: "10", name: "Docker", category: "DevOps", level: 60, description: "Container platform", iconColor: "from-blue-400 to-blue-600" },
    { id: "11", name: "GitLab", category: "CI/CD", level: 65, description: "Repository & CI/CD", iconColor: "from-orange-400 to-red-500" },
    { id: "12", name: "JWT", category: "Auth", level: 78, description: "JSON Web Tokens", iconColor: "from-yellow-500 to-orange-500" },
];

export default function TechStackSection({ skills }: { skills?: Skill[] }) {
    const displaySkills = skills ?? fallbackSkills;
    const categories = Array.from(new Set(displaySkills.map(s => s.category)));

    return (
        <section id="skills" className="py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary text-sm font-medium tracking-widest uppercase">Skills</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2">Tech Stack</h2>
                    <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">
                        Teknologi dan tools yang saya gunakan untuk membangun aplikasi web modern.
                    </p>
                </motion.div>

                {/* Skills Grid — grouped by category */}
                <div className="space-y-12">
                    {categories.map((category) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6 border-l-2 border-primary/50 pl-3">
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {displaySkills
                                    .filter(s => s.category === category)
                                    .map((skill, i) => {
                                        const Icon = iconMap[skill.name] ?? Code;
                                        const color = skill.iconColor ?? "from-primary/60 to-primary";
                                        return (
                                            <motion.div
                                                key={skill.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                                viewport={{ once: true }}
                                            >
                                                <div className="group relative flex items-center gap-4 p-4 bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl hover:bg-muted/30 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md cursor-default">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                    <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 z-10`}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex flex-col z-10 overflow-hidden">
                                                        <p className="text-sm font-bold text-foreground/90 truncate">{skill.name}</p>
                                                        {skill.description ? (
                                                            <p className="text-[11px] text-muted-foreground truncate" title={skill.description}>{skill.description}</p>
                                                        ) : (
                                                            <p className="text-[11px] text-muted-foreground/40 italic">Tech tool</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}