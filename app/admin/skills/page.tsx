"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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


type Skill = {
    id: string;
    name: string;
    level: number;
    category: string;
    description: string | null;
    iconColor: string | null;
    order: number;
};

const formSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter."),
    level: z.coerce.number().min(1, "Minimal 1").max(100, "Maksimal 100"),
    category: z.string().min(2, "Kategori wajib diisi"),
    description: z.string().optional(),
    iconColor: z.string().optional(),
    order: z.coerce.number().min(1, "Urutan minimal 1."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            level: 50,
            category: "Frontend",
            description: "",
            iconColor: "from-primary/50 to-primary",
            order: 1,
        },
    });

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/admin/skills");
            if (res.ok) {
                setSkills(await res.json());
            }
        } catch {
            toast.error("Gagal memuat skills");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const openAddDialog = () => {
        setEditingId(null);
        form.reset({
            name: "",
            level: 50,
            category: "Frontend",
            description: "",
            iconColor: "from-primary/50 to-primary",
            order: skills.length + 1,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (s: Skill) => {
        setEditingId(s.id);
        form.reset({
            name: s.name,
            level: s.level,
            category: s.category,
            description: s.description || "",
            iconColor: s.iconColor || "",
            order: s.order,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        setItemToDelete({ id, name });
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/admin/skills/${itemToDelete.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Skill dihapus");
                setSkills(prev => prev.filter(s => s.id !== itemToDelete.id));
            } else throw new Error();
        } catch {
            toast.error("Gagal menghapus skill");
        } finally {
            setItemToDelete(null);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setSaving(true);
        const payload = { ...data };

        try {
            const url = editingId ? `/api/admin/skills/${editingId}` : "/api/admin/skills";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();

            toast.success(`Skill berhasil di${editingId ? "perbarui" : "simpan"}`);
            setIsDialogOpen(false);
            fetchSkills();
        } catch {
            toast.error("Terjadi kesalahan saat menyimpan skill");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Keahlian & Skills</h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Tambah daftar keahlian, sesuaikan label warna, presentase keprofisienan, dan kategori stack-nya.
                    </p>
                </div>
                <Button onClick={openAddDialog} className="shrink-0 gap-2 h-10 px-5 shadow-sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Tambah Skill</span>
                    <span className="sm:hidden">Tambah</span>
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="border-b border-border/40 pb-4">
                        <DialogTitle className="text-xl">
                            {editingId ? "Edit Informasi Skill" : "Tambah Keahlian Baru"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nama Alat / Skill</FormLabel>
                                        <FormControl><Input placeholder="Visual Studio Code" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="level" render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Level (%)</FormLabel>
                                        <FormControl><Input type="number" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="order" render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Urutan</FormLabel>
                                        <FormControl><Input type="number" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pohon Kategori</FormLabel>
                                        <FormControl><Input placeholder="Frontend, IDE, Database.." className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="iconColor" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna Gradient (Tailwind Class)</FormLabel>
                                        <FormControl><Input placeholder="from-blue-400 to-blue-600" className="bg-background" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan Singkat <span className="text-muted-foreground font-normal">(Opsional)</span></FormLabel>
                                    <FormControl><Textarea className="h-20 resize-none bg-background" placeholder="Deskripsi singkat mengenai pengalaman..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                                <Button variant="ghost" type="button" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={saving} className="gap-2 min-w-[120px]">
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {saving ? "Memproses..." : "Simpan Skill"}
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
                        <span className="text-sm font-medium">Sinkronisasi Keahlian...</span>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="h-5 w-5 opacity-40" />
                        </div>
                        Daftar Skils Masih Kosong. Silahkan klik 'Tambah Skill'.
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[60px] text-center font-semibold border-r border-border/30">No</TableHead>
                                <TableHead className="font-semibold px-6">Identitas Skill</TableHead>
                                <TableHead className="font-semibold">Kelompok</TableHead>
                                <TableHead className="font-semibold w-[200px]">Profisiensi / Level</TableHead>
                                <TableHead className="text-right font-semibold w-[120px] pr-6">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skills.map((s) => (
                                <TableRow key={s.id} className="group hover:bg-muted/20 transition-colors">
                                    <TableCell className="text-center font-medium text-muted-foreground border-r border-border/30">{s.order}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-4 py-2">
                                            <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${s.iconColor || "from-muted/40 to-muted"} flex items-center justify-center text-white/90 shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                                                <Code2 className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="font-semibold text-sm">{s.name}</p>
                                                {s.description ? (
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[250px]">{s.description}</p>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground/30 italic">tanpa deskripsi</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-medium bg-background border border-border/40 hover:bg-muted font-mono text-[10px] uppercase tracking-wider">{s.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3 pr-4">
                                            <div className="h-2 flex-1 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                                                <div className="h-full bg-primary/80 relative overflow-hidden" style={{ width: `${s.level}%` }}>
                                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-muted-foreground w-8 text-right font-mono">{s.level}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => openEditDialog(s)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id, s.name)}>
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
                            Apakah Anda yakin ingin menghapus skill "{itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
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
