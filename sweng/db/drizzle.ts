import postgres from 'postgres'
import { drizzle } from "drizzle-orm/postgres-js"; 

const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_URL!, { prepare: false });
export const orm = drizzle(client);