import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './db/models/model.ts',
    out: './drizzle',
    dialect: 'postgresql',
    schemaFilter: ['public'],
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});