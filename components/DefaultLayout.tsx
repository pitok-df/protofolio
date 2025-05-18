'use client'

import { Toaster } from "sonner";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster position="top-center" richColors />
        </>
    )
}