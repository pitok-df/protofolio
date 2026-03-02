import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebarClient from "./admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    // Protect route
    const isAdmin =
        (session?.user as any)?.role === "ADMIN" ||
        (session?.user?.email && session.user.email === process.env.ADMIN_EMAIL);

    if (!isAdmin) {
        redirect("/"); // Redirect unauthorized users
    }

    return <AdminSidebarClient>{children}</AdminSidebarClient>;
}
