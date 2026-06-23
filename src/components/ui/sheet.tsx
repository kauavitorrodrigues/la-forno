"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
                className
            )}
            {...props}
        />
    );
}

function SheetContent({
    className,
    children,
    side = "right",
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    side?: "left" | "right";
}) {
    return (
        <SheetPortal>
            <SheetOverlay />
            <DialogPrimitive.Content
                className={cn(
                    "fixed z-50 flex flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
                    side === "right"
                        ? "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full"
                        : "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </SheetPortal>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-1.5 border-b px-4 py-4", className)}
            {...props}
        />
    );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("mt-auto flex flex-col gap-2 border-t px-4 py-3", className)}
            {...props}
        />
    );
}

function SheetTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            className={cn("text-base font-semibold leading-none tracking-tight", className)}
            {...props}
        />
    );
}

export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetPortal,
    SheetTitle,
    SheetTrigger,
};
