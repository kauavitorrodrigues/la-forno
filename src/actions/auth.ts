"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Credenciais inválidas. Verifique seu e-mail e senha." };
        }
        throw error;
    }

    redirect("/admin/pizzas");
}
