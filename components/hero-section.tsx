'use client';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from './ui/button';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';

interface HeroData {
    name: string;
    headline: string;
    imageUrl?: string | null;
}

export default function HeroSection({ profile }: { profile?: HeroData }) {
    const name = profile?.name ?? 'Pito Desri Pauzi';
    const headline = profile?.headline ?? 'Full Stack Developer';
    const imageUrl = profile?.imageUrl ?? '/pito-desri-pauzi.webp';

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative inline-block"
                    >
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-background shadow-xl"
                            />
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full ring-2 ring-background" />
                        </div>
                    </motion.div>

                    {/* Greeting badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium ring-1 ring-primary/20">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            Available for work
                        </span>
                    </motion.div>

                    {/* Name + Animated role */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            {name}
                        </h1>
                        <div className="h-10 flex items-center justify-center">
                            <TypeAnimation
                                sequence={[headline, 1500, 'React Developer', 1500, 'Node.js Developer', 1500, 'Laravel Developer', 1500]}
                                wrapper="p"
                                speed={50}
                                repeat={Infinity}
                                className="text-lg md:text-xl text-primary font-medium"
                            />
                        </div>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                    >
                        Membangun pengalaman digital yang intuitif dan berperforma tinggi lewat kode yang bersih.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-3 justify-center flex-wrap"
                    >
                        <Button
                            size="lg"
                            className="rounded-lg gap-2 shadow-lg shadow-primary/20"
                            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            View My Work
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-lg gap-2"
                            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Get in Touch
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}