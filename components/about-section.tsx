import { motion } from "framer-motion";
import { CountdownTimer } from "./countdown-timer";
import { Button } from "./ui/button";
import { Github, Linkedin } from "lucide-react";

const targetDate = new Date('2025-09-01T00:00:00Z'); // Set your target date here
export default function AboutSection() {
    return (
        <section id="about" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-8">About Me</h2>
                    <div className="space-y-8 text-center">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Saya seorang mahasiswa semester 6 dengan minat besar di dunia full-stack development.
                            Saya memiliki pengalaman dalam mengembangkan sistem backend dan merancang antarmuka pengguna yang sederhana namun efektif.
                            Saya selalu berusaha menulis kode yang bersih dan mudah dipelihara, serta menciptakan desain yang fokus pada kebutuhan pengguna.
                        </p>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold">Next Project Launch In</h3>
                            <CountdownTimer targetDate={targetDate} />
                        </div>
                        <div className="flex gap-4 justify-center">
                            <a href="https://github.com/PitokDf" target="_blank">
                                <Button variant="outline">
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </Button>
                            </a>
                            <a href="https://www.linkedin.com/in/pito-desri-pauzi-181052314/" target="_blank">
                                <Button variant="outline">
                                    <Linkedin className="mr-2 h-4 w-4" />
                                    LinkedIn
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}