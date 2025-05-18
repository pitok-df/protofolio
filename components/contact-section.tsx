"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [kouta, setKouta] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; kouta=`);
            const kouta = parts.pop()?.split(';').shift();
            if (kouta == "") {
                document.cookie = "kouta=5; path=/; max-age=86400"; // 1 jam
            }
            return kouta ? Number(kouta) : 5
        } else {
            return 0
        }
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            if (kouta <= 0) throw new Error("Kouta anda untuk mengirim email sudah habis!.")
            const res = await fetch("https://formsubmit.co/ajax/pitokfauzi@gmail.com", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
            });

            const data = await res.json();

            if (data.success === "true") {
                toast.success("Pesan berhasil dikirim!");
                form.reset();
                setKouta(kouta - 1)
                document.cookie = `kouta=${kouta - 1}; path=/; max-age=86400`;
            } else {
                toast.error("Gagal kirim pesan. Coba lagi ya.");
            }
        } catch (err: any) {
            toast.error(err.message === "Failed to fetch" ? "Terjadi kesalahan, cek koneksi kamu ya!" : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Get in Touch</h2>
                        <Card className="p-6">
                            <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                                        placeholder="Your message..."
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                    <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
