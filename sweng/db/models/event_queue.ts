import { pgTable, bigserial, bigint, uuid} from "drizzle-orm/pg-core";
import { event_log } from "./event";
import { donor } from "./donor";
import { queue_station } from "../enums/queue_station";
import { profiles } from "./profiles";

export const event_queue = pgTable("event_queue", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  event_log_id: bigint("event_log_id", { mode: "bigint" }).references(() => event_log.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  donor_id: bigint("donor_id", { mode: "bigint" }).references(() => donor.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  station: queue_station("station"),
  profile_id: uuid("profiles_id").references(() => profiles.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

