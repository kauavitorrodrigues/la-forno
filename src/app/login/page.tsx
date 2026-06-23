import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/admin/pizzas");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <div className="w-full max-w-sm">
                <div className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
                        <svg
                            width="16"
                            height="16"
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
                    <span className="font-semibold tracking-tight">La Forno</span>
                </div>
                <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
