import { PrismaClient, SessionStatus, SpotStatus, SpotType, VehicleType } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const prisma = new PrismaClient();
export type AuthRequest = Request & { user?: { id: string; garageId: string; email: string } };

export class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export function normalizePlate(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function authenticate(request: AuthRequest, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new AppError(401, "AUTH_REQUIRED", "Sign in to continue."));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "development-only-change-before-deployment") as AuthRequest["user"];
    request.user = payload;
    next();
  } catch { next(new AppError(401, "INVALID_TOKEN", "Your session is invalid or expired.")); }
}

export function signToken(user: { id: string; garageId: string; email: string }) {
  return jwt.sign(user, process.env.JWT_SECRET ?? "development-only-change-before-deployment", { expiresIn: "7d" });
}

export function feeFor(checkIn: Date, checkOut: Date, rate: { firstHourRatePaisa: number; additionalHourRatePaisa: number; dailyCapPaisa: number }) {
  const durationMinutes = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 60000));
  const billableHours = Math.max(1, Math.ceil(durationMinutes / 60));
  const wholeDays = Math.floor(billableHours / 24);
  const remainder = billableHours % 24;
  const hourly = (hours: number) => hours === 0 ? 0 : rate.firstHourRatePaisa + Math.max(0, hours - 1) * rate.additionalHourRatePaisa;
  const feePaisa = wholeDays * rate.dailyCapPaisa + Math.min(hourly(remainder), rate.dailyCapPaisa);
  return { durationMinutes, billableHours, feePaisa };
}

export const asSpotType = (value: string) => value.trim().toUpperCase().replace(/[^A-Z]/g, "") as SpotType;
export const vehicleTypes = [VehicleType.COMPACT, VehicleType.STANDARD, VehicleType.EV] as const;
export const spotTypes = [SpotType.COMPACT, SpotType.STANDARD, SpotType.EV] as const;
export const states = { SessionStatus, SpotStatus, SpotType, VehicleType };
