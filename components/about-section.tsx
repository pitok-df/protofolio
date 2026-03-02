'use client';
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Github, Linkedin, Clock } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "./countdown-timer";

interface AboutData {
    bio: string;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
}

const targetDate = new Date('2025-09-01T00:00:00Z');

export default function AboutSection({ profile }: { profile?: AboutData }) {
    const bio = profile?.bio ?? "Saya seorang mahasiswa semester 6 dengan minat besar di dunia full-stack development. Berpengalaman dalam mengembangkan sistem backend dan merancang antarmuka pengguna yang sederhana namun efektif. Saya selalu berusaha menulis kode yang bersih dan mudah dipelihara, serta menciptakan desain yang fokus pada kebutuhan pengguna.";
    const githubUrl = profile?.githubUrl ?? "https://github.com/PitokDf";
    const linkedinUrl = profile?.linkedinUrl ?? "https://www.linkedin.com/in/pito-desri-pauzi-181052314";

    return (
        <section id="about" className="py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">About Me</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Who I Am</h2>
                    </div>

                    {/* Content Card */}
                    <div className="bg-card border border-border/50 rounded-lg p-8 md:p-10 space-y-8">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto">
                            {bio}
                        </p>

                        {/* Countdown */}
                        <div className="border-t border-border/50 pt-8">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                                <Clock className="h-4 w-4" />
                                <span>Next Project Launch In</span>
                            </div>
                            <CountdownTimer targetDate={targetDate} />
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 justify-center pt-4 border-t border-border/50">
                            <Link href={githubUrl} target="_blank" title="GitHub">
                                <Button variant="outline" size="sm" className="gap-2 rounded-md hover:text-primary hover:border-primary/50 transition-all">
                                    <Github className="h-4 w-4" />
                                    GitHub
                                </Button>
                            </Link>
                            <Link href={linkedinUrl} target="_blank" title="LinkedIn">
                                <Button variant="outline" size="sm" className="gap-2 rounded-md hover:text-blue-500 hover:border-blue-500/50 transition-all">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}