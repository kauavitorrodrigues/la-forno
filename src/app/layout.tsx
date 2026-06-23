import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "La Forno — Pizzaria Artesanal",
    description: "Cardápio digital da La Forno Pizzaria Artesanal",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <body className="font-sans antialiased">
                {children}
                <Toaster position="bottom-center" />
            </body>
        </html>
    );
}
