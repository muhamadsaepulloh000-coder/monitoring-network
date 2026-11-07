CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "identity_key" TEXT NOT NULL,
    "ip" INET NOT NULL,
    "mac" TEXT,
    "hostname" TEXT,
    "is_online" BOOLEAN NOT NULL DEFAULT true,
    "missed_scans" INTEGER NOT NULL DEFAULT 0,
    "first_seen" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "devices_identity_key_key" ON "devices"("identity_key");
CREATE INDEX "devices_ip_idx" ON "devices"("ip");
CREATE INDEX "devices_is_online_last_seen_idx" ON "devices"("is_online", "last_seen");
