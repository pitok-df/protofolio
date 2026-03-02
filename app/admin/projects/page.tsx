"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


type Project = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    link: string | null;
    featured: boolean;
    order: number;
};

const formSchema = z.object({
    title: z.string().min(2, "Judul minimal 2 karakter."),
    description: z.string().min(5, "Deskripsi minimal 5 karakter."),
    tagsString: z.string().min(1, "Minimal 1 tag wajib diisi."),
    imageUrl: z.string().url("Sertakan URL gambar yang valid.").or(z.literal("")),
    link: z.string().url("Sertakan URL link yang valid.").or(z.literal("")),
    featured: z.boolean().default(false),
    order: z.coerce.number().min(1, "Urutan minimal 1."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            tagsString: "",
            imageUrl: "",
            link: "",
            featured: false,
            order: 1,
        },
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/admin/projects");
            if (res.ok) {
                setProjects(await res.json());
            }
        } catch {
            toast.error("Gagal memuat projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openAddDialog = () => {
        setEditingId(null);
        form.reset({
            title: "",
            description: "",
            tagsString: "",
            imageUrl: "",
            link: "",
            featured: false,
            order: projects.length + 1,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (p: Project) => {
        setEditingId(p.id);
        form.reset({
            title: p.title,
            description: p.description,
            tagsString: p.tags.join(", "),
            imageUrl: p.imageUrl,
            link: p.link || "",
            featured: p.featured,
            order: p.order,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string, title: string) => {
        setItemToDelete({ id, name: title });
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/admin/projects/${itemToDelete.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Project dihapus");
                setProjects(prev => prev.filter(p => p.id !== itemToDelete.id));
            } else throw new Error();
        } catch {
            toast.error("Gagal menghapus project");
        } finally {
            setItemToDelete(null);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setSaving(true);
        const payload = {
            title: data.title,
            description: data.description,
            tags: data.tagsString.split(",").map(t => t.trim()).filter(Boolean),
            imageUrl: data.imageUrl,
            link: data.link || null,
            featured: data.featured,
            order: data.order,
        };

        try {
            const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();

            toast.success(`Project berhasil di${editingId ? "perbarui" : "simpan"}`);
            setIsDialogOpen(false);
            fetchProjects();
        } catch {
            toast.error("Terjadi kesalahan saat menyimpan project");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Projects</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Kelola arsip fitur showcase / projects yang akan dipajang berdasarkan peringkat dan sorotan (Featured).
                    </p>
                </div>
                <Button onClick={openAddDialog} className="shrink-0 gap-2 h-10 px-5 shadow-sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah Project</span>
                    <span className="sm:hidden">Tambah</span>
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="border-b border-border/40 pb-4">
                        <DialogTitle className="text-xl">
                            {editingId ? "Edit Konfigurasi Project" : "Registrasi Project Baru"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <div className="grid md:grid-cols-3 gap-6">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Judul Project</FormLabel>
                                        <FormControl><Input placeholder="Contoh: POS Bengkel App" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="order" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Urut Tampil</FormLabel>
                                        <FormControl><Input type="number" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi / Sinopsis</FormLabel>
                                    <FormControl><Textarea className="h-28 resize-none bg-background" placeholder="Deskripsi latar belakang, fitur pokok yang dikembangkan..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="tagsString" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tech Stack / Tags</FormLabel>
                                    <FormControl><Input placeholder="Next.js, Prisma ORM, Tailwind CSS" className="bg-background" {...field} /></FormControl>
                                    <FormDescription>Gunakan sparata comma <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">,</kbd> di antara elemen tech stacknya.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid md:grid-cols-2 gap-6 pb-2">
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Image / Cover URL</FormLabel>
                                        <FormControl><Input placeholder="https:// ... " className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="link" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direct URL Access (Live) <span className="text-muted-foreground font-normal">(Opsional)</span></FormLabel>
                                        <FormControl><Input placeholder="https://..." className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="featured" render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:bg-muted/40 cursor-pointer">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" />
                                    </FormControl>
                                    <div className="space-y-1 leading-none cursor-pointer" onClick={() => field.onChange(!field.value)}>
                                        <FormLabel className="font-semibold text-base cursor-pointer">Tandai Featured Project</FormLabel>
                                        <FormDescription className="cursor-pointer text-xs">Sorot proyek ini secara eksklusif agar mendapatkan atensi prioritas.</FormDescription>
                                    </div>
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                                <Button variant="ghost" type="button" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={saving} className="gap-2 min-w-[120px]">
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {saving ? "Memproses..." : "Simpan Project"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="border border-border/50 bg-background/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/60 mx-auto" />
                        <span className="text-sm font-medium">Sinkronisasi Database...</span>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-5 w-5 opacity-40" />
                        </div>
                        Portofolio Karya Belum Diisi. Tekan Tombol Tambah di Pojok Kanan Atas.
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[60px] text-center font-semibold border-r border-border/30">Rank</TableHead>
                                <TableHead className="font-semibold px-6">Informasi Project</TableHead>
                                <TableHead className="font-semibold min-w-[200px]">Tech Stack Layout</TableHead>
                                <TableHead className="text-center font-semibold w-[120px]">Highlight</TableHead>
                                <TableHead className="text-right font-semibold w-[120px] pr-6">Tindakan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((p) => (
                                <TableRow key={p.id} className="group hover:bg-muted/20 transition-colors">
                                    <TableCell className="text-center font-medium text-muted-foreground border-r border-border/30">{p.order}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="h-14 w-20 shrink-0 bg-muted rounded-lg overflow-hidden border border-border/40 hidden sm:flex items-center justify-center shadow-sm relative">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 max-w-[300px]">
                                                <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                                                {p.link ? (
                                                    <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-primary/80 hover:text-primary hover:underline line-clamp-1 truncate">
                                                        {p.link.replace(/^https?:\/\//, '')}
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground italic">- link tidak disematkan -</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5 py-1">
                                            {p.tags.slice(0, 3).map(t => (
                                                <Badge variant="secondary" className="text-[10px] font-medium bg-background border border-border/50 hover:bg-muted" key={t}>{t}</Badge>
                                            ))}
                                            {p.tags.length > 3 && (
                                                <Badge variant="outline" className="text-[10px] bg-muted/20 border-dashed text-muted-foreground">
                                                    +{p.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {p.featured ? (
                                            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 shadow-none pointer-events-none">✨ Featured</Badge>
                                        ) : (
                                            <span className="text-muted-foreground/40 text-sm font-medium">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => openEditDialog(p)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id, p.title)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus project "{itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
