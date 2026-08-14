import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as { dbClient?: ReturnType<typeof postgres> };

const client = globalForDb.dbClient ?? postgres(connectionString, {
    prepare: false,
    ssl: "require",
    max: 5,
    idle_timeout: 20,
});

globalForDb.dbClient = client;

export const orm = drizzle(client);