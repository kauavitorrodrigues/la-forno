"use client";

import * as React from "react";
import { Sheet } from "@/components/ui/sheet";
import { CartTrigger } from "./CartTrigger";
import { MiniCart } from "./MiniCart";

export function HeaderCartSheet() {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <CartTrigger />
            <MiniCart onClose={() => setOpen(false)} />
        </Sheet>
    );
}
