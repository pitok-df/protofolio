'use client'

import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toogle";
import { LoginButton } from "./auth/login-button";

export default function NavigationBar() {
    const [activeSection, setActiveSection] = useState("hero");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowNav(currentScrollY < lastScrollY || currentScrollY < 80);
            setLastScrollY(currentScrollY);
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((currentScrollY / totalScroll) * 100);

            const sections = ["hero", "about", "skills", "portfolio", "contact", "comments"];
            const current = sections.find(section => {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { label: "About", id: "about" },
        { label: "Skills", id: "skills" },
        { label: "Portfolio", id: "portfolio" },
        { label: "Contact", id: "contact" },
    ];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-transform duration-300 ${showNav ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="bg-background/80 backdrop-blur-xl border-b border-border/50">
                    <div className="container mx-auto px-4">
                        <div className="h-16 flex items-center justify-between gap-4">
                            {/* Logo */}
                            <button
                                onClick={() => scrollTo("hero")}
                                className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 shrink-0"
                            >
                                Pitok<span className="text-foreground">.</span>dev
                            </button>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollTo(item.id)}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${activeSection === item.id
                                                ? "text-primary bg-primary/10 font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <LoginButton />
                                {/* Mobile hamburger */}
                                <button
                                    className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    aria-label="Toggle menu"
                                >
                                    <div className="space-y-1.5">
                                        <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                                        <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                                        <span className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scroll progress bar */}
                    <div className="h-0.5 bg-border/30">
                        <div
                            className="h-full bg-primary transition-all duration-150"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors ${activeSection === item.id
                                            ? "text-primary bg-primary/10 font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}