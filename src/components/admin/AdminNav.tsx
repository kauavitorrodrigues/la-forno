"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Props = {
    userEmail: string;
};

export function AdminNav({ userEmail }: Props) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pizzas" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm tracking-tight">La Forno</span>
                    </Link>
                    <span className="text-xs text-muted-foreground hidden sm:inline">Admin</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
                        {userEmail}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="size-4" />
                        <span className="hidden sm:inline">Sair</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
