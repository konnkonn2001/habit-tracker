import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // env() を使うと、DATABASE_URLが無いコマンドでも落ちることがあるので
    // まずは process.env で固定しておくのが安全
    url: process.env.DATABASE_URL!,
  },
});