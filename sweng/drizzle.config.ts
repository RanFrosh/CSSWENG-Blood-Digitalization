export default {
    schema: './db/models/model.ts',
    out: './drizzle',
    dialect: 'postgresql',
    schemaFilter: ['public'],
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
};