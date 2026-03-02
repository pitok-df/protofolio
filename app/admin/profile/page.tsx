"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter."),
    headline: z.string().min(2, "Headline terlalu pendek."),
    bio: z.string().min(10, "Bio minimal 10 karakter."),
    imageUrl: z.string().url("Sertakan URL gambar yang valid.").or(z.literal("")),
    githubUrl: z.string().url("URL tidak valid.").or(z.literal("")),
    linkedinUrl: z.string().url("URL tidak valid.").or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            headline: "",
            bio: "",
            imageUrl: "",
            githubUrl: "",
            linkedinUrl: "",
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/admin/profile");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.name) {
                        form.reset({
                            name: data.name || "",
                            headline: data.headline || "",
                            bio: data.bio || "",
                            imageUrl: data.imageUrl || "",
                            githubUrl: data.githubUrl || "",
                            linkedinUrl: data.linkedinUrl || "",
                        });
                    }
                }
            } catch (error) {
                toast.error("Gagal mengambil data profil.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [form]);

    async function onSubmit(data: FormValues) {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error();
            toast.success("Profil berhasil diperbarui!");
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan profil.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kelola Profil</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Update informasi lengkap portofolio Anda. Preview ini akan langsung ditampilkan di halaman utama Hero Section dan About.
                </p>
            </div>

            <Card className="border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
                <CardHeader className="border-b border-border/40 pb-6">
                    <CardTitle>Data Pribadi & Sosial Media</CardTitle>
                    <CardDescription>
                        Ubah Headline, Bio, hingga foto profil Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/90">Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" className="bg-background" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="headline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/90">Headline / Profesi</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full Stack Developer" className="bg-background" {...field} />
                                            </FormControl>
                                            <FormDescription>Bisa berupa profesi atau keahlian utama.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90">Biodata Lengkap (About Me)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ceritakan riwayat ringkas tentang jenjang studi, hobi, dsb..." className="h-32 resize-none bg-background" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/90">URL Gambar Avatar / Cover</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/profile.webp atau https://..." className="bg-background" {...field} />
                                            </FormControl>
                                            <div className="mt-4 flex justify-center p-4 bg-muted/30 border border-dashed border-border rounded-xl">
                                                {field.value && field.value.length > 3 ? (
                                                    <img src={field.value} alt="Preview" className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-background" />
                                                ) : (
                                                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground text-center p-4 border-4 border-background shadow-sm">Preview Kosong</div>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-6 flex flex-col justify-start mt-1">
                                    <FormField
                                        control={form.control}
                                        name="githubUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/90">GitHub URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/YourUsername" className="bg-background" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="linkedinUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground/90">LinkedIn URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://linkedin.com/..." className="bg-background" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-border/40">
                                <Button type="submit" disabled={saving} className="gap-2 w-full sm:w-auto min-w-[150px]">
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {saving ? "Menyimpan Data..." : "Simpan Perubahan Profile"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
