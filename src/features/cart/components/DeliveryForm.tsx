"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeliverySchema, type DeliverySchemaType } from "../schemas/delivery.schema";
import { saveCustomerData } from "../hooks/useCustomerData";

const CEP_DIGITS_RE = /^\d{8}$/;

type ViaCepResponse = {
    erro?: boolean;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
};

async function fetchAddressByCep(digits: string): Promise<ViaCepResponse | null> {
    try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (!res.ok) return null;
        const data: ViaCepResponse = await res.json();
        return data.erro ? null : data;
    } catch {
        return null;
    }
}

type Props = {
    defaultValues: DeliverySchemaType;
    onSubmit: (data: DeliverySchemaType) => void;
    isSubmitting: boolean;
};

export function DeliveryForm({ defaultValues, onSubmit, isSubmitting }: Props) {
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const form = useForm<DeliverySchemaType>({
        resolver: zodResolver(DeliverySchema),
        defaultValues,
    });

    const cepValue = useWatch({ control: form.control, name: "cep" });

    useEffect(() => {
        const digits = cepValue?.replace(/\D/g, "") ?? "";

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!CEP_DIGITS_RE.test(digits)) {
            setCepError(null);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setCepLoading(true);
            setCepError(null);

            const address = await fetchAddressByCep(digits);

            setCepLoading(false);

            if (!address) {
                setCepError("CEP não encontrado.");
                return;
            }

            form.setValue("street", address.logradouro, { shouldValidate: true });
            form.setValue("district", address.bairro, { shouldValidate: true });
            form.setValue("city", address.localidade, { shouldValidate: true });
            form.setValue("state", address.uf, { shouldValidate: true });
        }, 600);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [cepValue, form]);

    const handleSubmit = (data: DeliverySchemaType) => {
        saveCustomerData({ ...data, complement: data.complement || undefined });
        onSubmit({ ...data, complement: data.complement || undefined });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                                <Input placeholder="João Silva" disabled={isSubmitting} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="00000-000"
                                        disabled={isSubmitting}
                                        {...field}
                                        className={cepLoading ? "pr-9" : ""}
                                    />
                                    {cepLoading && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            {cepError && (
                                <p className="text-xs text-destructive">{cepError}</p>
                            )}
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Belo Horizonte"
                                        disabled={isSubmitting || cepLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="MG"
                                        disabled={isSubmitting || cepLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Centro"
                                    disabled={isSubmitting || cepLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rua *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Rua das Flores"
                                    disabled={isSubmitting || cepLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número *</FormLabel>
                                <FormControl>
                                    <Input placeholder="123" disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apto 201" disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="mt-2 h-11 w-full rounded-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting || cepLoading}
                >
                    {isSubmitting ? "Abrindo WhatsApp..." : "Finalizar pelo WhatsApp"}
                </Button>
            </form>
        </Form>
    );
}
