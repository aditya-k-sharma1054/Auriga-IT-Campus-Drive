import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("apps/api/prisma/dev.db");
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS "Garage" (
    "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL, "garageId" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL, FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS "SpotRate" (
    "id" TEXT NOT NULL PRIMARY KEY, "garageId" TEXT NOT NULL, "spotType" TEXT NOT NULL,
    "firstHourRatePaisa" INTEGER NOT NULL, "additionalHourRatePaisa" INTEGER NOT NULL, "dailyCapPaisa" INTEGER NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE,
    UNIQUE("garageId", "spotType")
  );
  CREATE TABLE IF NOT EXISTS "ParkingSpot" (
    "id" TEXT NOT NULL PRIMARY KEY, "garageId" TEXT NOT NULL, "floor" INTEGER NOT NULL, "number" TEXT NOT NULL,
    "type" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'AVAILABLE', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL, FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE,
    UNIQUE("garageId", "floor", "number")
  );
  CREATE TABLE IF NOT EXISTS "ParkingSession" (
    "id" TEXT NOT NULL PRIMARY KEY, "garageId" TEXT NOT NULL, "spotId" TEXT NOT NULL, "plateNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL, "checkedInAt" DATETIME NOT NULL, "checkedOutAt" DATETIME, "feePaisa" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE,
    FOREIGN KEY ("spotId") REFERENCES "ParkingSpot"("id") ON DELETE RESTRICT
  );
  CREATE TABLE IF NOT EXISTS "PlateTransfer" (
    "id" TEXT NOT NULL PRIMARY KEY, "sessionId" TEXT NOT NULL, "previousPlateNumber" TEXT NOT NULL,
    "newPlateNumber" TEXT NOT NULL, "transferredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sessionId") REFERENCES "ParkingSession"("id") ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS "User_garageId_idx" ON "User"("garageId");
  CREATE INDEX IF NOT EXISTS "ParkingSpot_garageId_type_status_idx" ON "ParkingSpot"("garageId", "type", "status");
  CREATE INDEX IF NOT EXISTS "ParkingSession_garageId_status_idx" ON "ParkingSession"("garageId", "status");
  CREATE INDEX IF NOT EXISTS "ParkingSession_garageId_plateNumber_status_idx" ON "ParkingSession"("garageId", "plateNumber", "status");
  CREATE INDEX IF NOT EXISTS "ParkingSession_garageId_checkedInAt_idx" ON "ParkingSession"("garageId", "checkedInAt");
  CREATE INDEX IF NOT EXISTS "ParkingSession_garageId_checkedOutAt_idx" ON "ParkingSession"("garageId", "checkedOutAt");
  CREATE INDEX IF NOT EXISTS "PlateTransfer_sessionId_idx" ON "PlateTransfer"("sessionId");
`);
db.close();
console.log("ParkOps SQLite schema is ready.");
