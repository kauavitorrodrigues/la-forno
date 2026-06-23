"use client";

import { useState } from "react";
import Image from "next/image";
import type { Pizza } from "@prisma/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { deletePizzaAction } from "@/actions/pizzas";
import { PizzaFormDialog } from "@/components/admin/PizzaFormDialog";

type Props = {
    pizzas: Pizza[];
};

export function PizzasTable({ pizzas }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Pizza | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Pizza | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const result = await deletePizzaAction(deleteTarget.id);
            if (result.success) {
                toast.success(`"${deleteTarget.name}" removida com sucesso.`);
                setDeleteTarget(null);
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Erro ao remover pizza.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex justify-end">
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="size-4" />
                    Nova pizza
                </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagem</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pizzas.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground py-12"
                                >
                                    Nenhuma pizza cadastrada. Crie a primeira!
                                </TableCell>
                            </TableRow>
                        ) : (
                            pizzas.map((pizza) => (
                                <TableRow key={pizza.id}>
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border bg-secondary">
                                            <Image
                                                src={pizza.imageUrl}
                                                alt={pizza.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">{pizza.name}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                                                {pizza.description}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs font-mono">
                                            {pizza.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm font-medium">
                                            {formatPrice(pizza.price)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setEditTarget(pizza)}
                                                title="Editar pizza"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setDeleteTarget(pizza)}
                                                title="Remover pizza"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <PizzaFormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                mode="create"
            />

            {/* Edit Dialog */}
            {editTarget && (
                <PizzaFormDialog
                    open={editTarget !== null}
                    onOpenChange={(open) => {
                        if (!open) setEditTarget(null);
                    }}
                    mode="edit"
                    pizza={editTarget}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Remover pizza</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja remover{" "}
                            <span className="font-semibold text-foreground">
                                "{deleteTarget?.name}"
                            </span>
                            ? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Removendo..." : "Remover"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
