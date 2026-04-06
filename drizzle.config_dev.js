import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

export default defineConfig({
    dialect: "postgresql",
    schema: "src/infrastructure/persistence/schema/*.js",
    out: "src/infrastructure/persistence/migrations",
    dbCredentials: {
        url: process.env.PG_DATABASE_URL
    }
});
