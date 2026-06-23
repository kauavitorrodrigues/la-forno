"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/auth";

const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [isPending, setIsPending] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsPending(true);
        try {
            const result = await loginAction(data.email, data.password);
            if (result?.error) {
                toast.error(result.error);
                form.setError("root", { message: result.error });
            }
        } catch {
            // redirect throws, which is expected on success
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Acesso administrativo
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Entre com suas credenciais para continuar
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="admin@laforno.com"
                                        autoComplete="email"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Sua senha"
                                        autoComplete="current-password"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {form.formState.errors.root && (
                    <p className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isPending}
                >
                    {isPending ? "Entrando..." : "Entrar"}
                </Button>
            </form>
        </Form>
    );
}
