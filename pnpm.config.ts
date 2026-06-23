import { defineConfig } from "pnpm/config";

export default defineConfig({
    onlyBuiltDependencies: ["@prisma/client", "@prisma/engines", "prisma", "sharp"],
});
