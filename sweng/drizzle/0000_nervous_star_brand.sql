CREATE TABLE IF NOT EXISTS "assigned_staff" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"staff_id" uuid NOT NULL,
	"event_log_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"province_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "corrected_event" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone,
	"visitors" bigint,
	"extractions" bigint,
	"produced_bags" bigint,
	"target_blood" bigint,
	"perk_claims" bigint,
	"name" text,
	"city_id" bigint,
	"zip_code" text,
	"street" text,
	"ref_event_id" bigint NOT NULL,
	"ref_profile_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donor" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"blood" "blood_type" NOT NULL,
	"birthdate" date,
	"age" integer,
	"sex" "biological_sex" NOT NULL,
	"height" double precision,
	"weight" double precision,
	"city_id" bigint NOT NULL,
	"zip_code" text,
	"email" text NOT NULL,
	"mobile_no" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"verifiedBlood" boolean DEFAULT false NOT NULL,
	"medicalNote" text,
	"assessment_status" "assessment_status",
	"next_eligibility" date,
	"qr_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"delete_datetime" timestamp with time zone,
	"delete_reason" text,
	"deleted_by" bigint,
	CONSTRAINT "donor_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"partner" text NOT NULL,
	"street" text,
	"zip_code" text,
	"city_id" bigint NOT NULL,
	"event_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time,
	"status" "event_status" DEFAULT 'Upcoming' NOT NULL,
	"visitors" bigint DEFAULT 0 NOT NULL,
	"extractions" bigint DEFAULT 0 NOT NULL,
	"produced_bags" bigint DEFAULT 0 NOT NULL,
	"target_blood" bigint DEFAULT 0 NOT NULL,
	"perk_claims" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_queue" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"event_log_id" bigint,
	"donor_id" bigint,
	"staff_id" uuid,
	"station" "queue_station",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" "access_level" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "province" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blood_bag" (
    id BIGSERIAL PRIMARY KEY,
    serial_number TEXT UNIQUE NOT NULL,
    donor_id BIGINT REFERENCES donor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    event_id BIGINT REFERENCES event_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    blood_type "blood_type" NOT NULL,
    volume_ml INTEGER NOT NULL,
    collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    outcome VARCHAR(50) DEFAULT 'success',
    quality VARCHAR(50) DEFAULT 'good',
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donor_to_event" (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT NOT NULL REFERENCES donor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    event_id BIGINT NOT NULL REFERENCES event_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    is_success BOOLEAN NOT NULL DEFAULT false,
    blood_amount INTEGER,
    perk_claimed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "assigned_staff" ADD CONSTRAINT "assigned_staff_staff_id_profiles_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assigned_staff" ADD CONSTRAINT "assigned_staff_event_log_id_event_log_id_fk" FOREIGN KEY ("event_log_id") REFERENCES "public"."event_log"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_province_id_province_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrected_event" ADD CONSTRAINT "corrected_event_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrected_event" ADD CONSTRAINT "corrected_event_ref_event_id_event_log_id_fk" FOREIGN KEY ("ref_event_id") REFERENCES "public"."event_log"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrected_event" ADD CONSTRAINT "corrected_event_ref_profile_id_profiles_id_fk" FOREIGN KEY ("ref_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donor" ADD CONSTRAINT "donor_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_log" ADD CONSTRAINT "event_log_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_queue" ADD CONSTRAINT "event_queue_event_log_id_event_log_id_fk" FOREIGN KEY ("event_log_id") REFERENCES "public"."event_log"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "event_queue" ADD CONSTRAINT "event_queue_donor_id_donor_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donor"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "event_queue" ADD CONSTRAINT "event_queue_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;