import bcrypt from "bcrypt";
import { Router } from "express";
import { SpotType } from "@prisma/client";
import { z } from "zod";
import { AppError, asSpotType, authenticate, AuthRequest, feeFor, normalizePlate, prisma, signToken, spotTypes, states, vehicleTypes } from "./lib.js";

const money = z.coerce.number().int().nonnegative();
const sessionSelect = { include: { spot: true } } as const;
const userView = (user: { id: string; name: string; email: string; garageId: string }) => ({ id: user.id, name: user.name, email: user.email, garageId: user.garageId });

async function createGarageInventory(name: string, address: string) {
  const garage = await prisma.garage.create({ data: { name, address } });
  await prisma.$transaction([
    prisma.spotRate.createMany({ data: spotTypes.map((spotType) => ({ garageId: garage.id, spotType, firstHourRatePaisa: 5000, additionalHourRatePaisa: 3000, dailyCapPaisa: 25000 })) }),
    prisma.parkingSpot.createMany({ data: Array.from({ length: 30 }, (_, index) => {
      const floor = Math.floor(index / 10) + 1;
      const position = index % 10 + 1;
      const type = position <= 2 ? states.SpotType.EV : position <= 5 ? states.SpotType.COMPACT : states.SpotType.STANDARD;
      return { garageId: garage.id, floor, number: `${type.slice(0, 2)}-${String(position).padStart(2, "0")}`, type };
    }) }),
  ]);
  return garage;
}

async function closeSession(sessionId: string, garageId: string, checkedOutAt: Date) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.parkingSession.findFirst({ where: { id: sessionId, garageId, status: states.SessionStatus.ACTIVE }, include: { spot: true } });
    if (!session) throw new AppError(409, "SESSION_NOT_ACTIVE", "This parking session is no longer active.");
    const rate = await tx.spotRate.findUnique({ where: { garageId_spotType: { garageId, spotType: session.spot.type } } });
    if (!rate) throw new AppError(422, "RATE_NOT_CONFIGURED", `No cleaned ${session.spot.type} rate is configured.`);
    const billing = feeFor(session.checkedInAt, checkedOutAt, rate);
    const completed = await tx.parkingSession.update({ where: { id: session.id }, data: { status: states.SessionStatus.COMPLETED, checkedOutAt, feePaisa: billing.feePaisa }, include: { spot: true } });
    const released = await tx.parkingSpot.updateMany({ where: { id: session.spotId, garageId, status: states.SpotStatus.OCCUPIED }, data: { status: states.SpotStatus.AVAILABLE } });
    if (released.count !== 1) throw new AppError(409, "SPOT_STATE_CONFLICT", "The occupied spot could not be released safely.");
    return { session: completed, billing };
  });
}

export const authRouter = Router();
authRouter.post("/register", async (request, response, next) => {
  try {
    const input = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), garageName: z.string().min(2), garageAddress: z.string().min(2) }).parse(request.body);
    if (await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })) throw new AppError(409, "EMAIL_IN_USE", "An account already uses this email address.");
    const garage = await createGarageInventory(input.garageName.trim(), input.garageAddress.trim());
    const user = await prisma.user.create({ data: { name: input.name.trim(), email: input.email.toLowerCase(), passwordHash: await bcrypt.hash(input.password, 12), garageId: garage.id } });
    response.status(201).json({ user: userView(user), token: signToken(user) });
  } catch (error) { next(error); }
});
authRouter.post("/login", async (request, response, next) => {
  try {
    const input = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    response.json({ user: userView(user), token: signToken(user) });
  } catch (error) { next(error); }
});
authRouter.get("/me", authenticate, async (request: AuthRequest, response, next) => { try { const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user!.id } }); response.json({ user: userView(user) }); } catch (error) { next(error); } });

export const appRouter = Router();
appRouter.use(authenticate);
appRouter.get("/dashboard/summary", async (request: AuthRequest, response, next) => { try {
  const garageId = request.user!.garageId;
  const [totalSpots, occupiedSpots, evTotal, evAvailable, activeSessions] = await Promise.all([
    prisma.parkingSpot.count({ where: { garageId } }), prisma.parkingSpot.count({ where: { garageId, status: states.SpotStatus.OCCUPIED } }), prisma.parkingSpot.count({ where: { garageId, type: states.SpotType.EV } }), prisma.parkingSpot.count({ where: { garageId, type: states.SpotType.EV, status: states.SpotStatus.AVAILABLE } }), prisma.parkingSession.count({ where: { garageId, status: states.SessionStatus.ACTIVE } }),
  ]);
  response.json({ totalSpots, occupiedSpots, availableSpots: totalSpots - occupiedSpots, evTotal, evAvailable, activeSessions });
} catch (error) { next(error); } });
appRouter.get("/garage", async (request: AuthRequest, response, next) => { try { response.json(await prisma.garage.findUniqueOrThrow({ where: { id: request.user!.garageId }, include: { rates: { orderBy: { spotType: "asc" } } } })); } catch (error) { next(error); } });
appRouter.get("/spots/availability", async (request: AuthRequest, response, next) => { try { const type = z.enum(["COMPACT", "STANDARD", "EV"]).default("EV").parse(request.query.type); const spots = await prisma.parkingSpot.findMany({ where: { garageId: request.user!.garageId, type: type as SpotType }, orderBy: [{ floor: "asc" }, { number: "asc" }] }); response.json({ type, total: spots.length, available: spots.filter((spot) => spot.status === states.SpotStatus.AVAILABLE).length, spots }); } catch (error) { next(error); } });
appRouter.post("/rates/import", async (request: AuthRequest, response, next) => { try {
  const body = z.object({ rates: z.array(z.object({ spotType: z.string(), firstHourRatePaisa: money, additionalHourRatePaisa: money, dailyCapPaisa: money })).optional(), rawRateCard: z.string().optional() }).refine((value) => value.rates || value.rawRateCard, "Provide rates or rawRateCard.").parse(request.body);
  const rejected: string[] = [];
  const parsed = body.rates ?? body.rawRateCard!.split(/\r?\n/).flatMap((line) => { const type = line.match(/compact|standard|ev/i)?.[0]; const numbers = line.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []; if (!type || numbers.length < 3) { if (line.trim()) rejected.push(line); return []; } return [{ spotType: type, firstHourRatePaisa: Math.round(numbers[0] * 100), additionalHourRatePaisa: Math.round(numbers[1] * 100), dailyCapPaisa: Math.round(numbers[2] * 100) }]; });
  const accepted: string[] = [];
  await prisma.$transaction(parsed.map((row) => { const spotType = asSpotType(row.spotType); if (!spotTypes.includes(spotType)) { rejected.push(row.spotType); return prisma.$executeRaw`SELECT 1`; } accepted.push(spotType); return prisma.spotRate.upsert({ where: { garageId_spotType: { garageId: request.user!.garageId, spotType } }, create: { ...row, garageId: request.user!.garageId, spotType }, update: { firstHourRatePaisa: row.firstHourRatePaisa, additionalHourRatePaisa: row.additionalHourRatePaisa, dailyCapPaisa: row.dailyCapPaisa, importedAt: new Date() } }); }));
  response.json({ accepted: [...new Set(accepted)], rejected, rates: await prisma.spotRate.findMany({ where: { garageId: request.user!.garageId } }) });
} catch (error) { next(error); } });
appRouter.post("/parking/check-in", async (request: AuthRequest, response, next) => { try {
  const input = z.object({ plateNumber: z.string().min(2).max(20), vehicleType: z.enum(vehicleTypes) }).parse(request.body); const garageId = request.user!.garageId; const plateNumber = normalizePlate(input.plateNumber);
  const result = await prisma.$transaction(async (tx) => { if (await tx.parkingSession.findFirst({ where: { garageId, plateNumber, status: states.SessionStatus.ACTIVE } })) throw new AppError(409, "DUPLICATE_ACTIVE_SESSION", "This vehicle is already parked."); const spot = await tx.parkingSpot.findFirst({ where: { garageId, type: input.vehicleType, status: states.SpotStatus.AVAILABLE }, orderBy: [{ floor: "asc" }, { number: "asc" }] }); if (!spot) throw new AppError(409, "SPOT_UNAVAILABLE", `No ${input.vehicleType} spot is available.`); const claimed = await tx.parkingSpot.updateMany({ where: { id: spot.id, status: states.SpotStatus.AVAILABLE }, data: { status: states.SpotStatus.OCCUPIED } }); if (claimed.count !== 1) throw new AppError(409, "SPOT_STATE_CONFLICT", "Spot selection changed; try again."); const session = await tx.parkingSession.create({ data: { garageId, spotId: spot.id, plateNumber, vehicleType: input.vehicleType, checkedInAt: new Date() } }); return { session, spot }; }); response.status(201).json(result);
} catch (error) { next(error); } });
appRouter.get("/parking/active", async (request: AuthRequest, response, next) => { try { const page = Math.max(1, Number(request.query.page ?? 1)); const pageSize = Math.min(50, Math.max(1, Number(request.query.pageSize ?? 10))); const [items, total] = await Promise.all([prisma.parkingSession.findMany({ where: { garageId: request.user!.garageId, status: states.SessionStatus.ACTIVE }, include: { spot: true }, orderBy: { checkedInAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }), prisma.parkingSession.count({ where: { garageId: request.user!.garageId, status: states.SessionStatus.ACTIVE } })]); response.json({ items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } }); } catch (error) { next(error); } });
appRouter.get("/parking/search", async (request: AuthRequest, response, next) => { try { const plate = normalizePlate(z.string().min(1).parse(request.query.plate)); response.json({ items: await prisma.parkingSession.findMany({ where: { garageId: request.user!.garageId, status: states.SessionStatus.ACTIVE, plateNumber: { contains: plate } }, include: { spot: true } }) }); } catch (error) { next(error); } });
appRouter.post("/parking/:sessionId/check-out", async (request: AuthRequest, response, next) => { try { const sessionId = z.string().uuid().parse(request.params.sessionId); const result = await closeSession(sessionId, request.user!.garageId, new Date()); response.json({ ...result, billing: { ...result.billing, feeDisplay: `₹${(result.billing.feePaisa / 100).toFixed(2)}` } }); } catch (error) { next(error); } });
appRouter.post("/parking/:sessionId/transfer-plate", async (request: AuthRequest, response, next) => { try { const sessionId = z.string().uuid().parse(request.params.sessionId); const plateNumber = normalizePlate(z.object({ plateNumber: z.string().min(2).max(20) }).parse(request.body).plateNumber); const garageId = request.user!.garageId; const session = await prisma.$transaction(async (tx) => { const active = await tx.parkingSession.findFirst({ where: { id: sessionId, garageId, status: states.SessionStatus.ACTIVE } }); if (!active) throw new AppError(409, "SESSION_NOT_ACTIVE", "Only an active session can be transferred."); if (await tx.parkingSession.findFirst({ where: { garageId, plateNumber, status: states.SessionStatus.ACTIVE, id: { not: active.id } } })) throw new AppError(409, "DUPLICATE_ACTIVE_SESSION", "The new plate already has an active session."); await tx.plateTransfer.create({ data: { sessionId: active.id, previousPlateNumber: active.plateNumber, newPlateNumber: plateNumber } }); return tx.parkingSession.update({ where: { id: active.id }, data: { plateNumber }, include: { spot: true } }); }); response.json({ session }); } catch (error) { next(error); } });
appRouter.get("/parking/history", async (request: AuthRequest, response, next) => { try {
  const query = z.object({ page: z.coerce.number().int().positive().default(1), pageSize: z.coerce.number().int().min(1).max(50).default(10), search: z.string().optional(), sortBy: z.enum(["checkedInAt", "checkedOutAt", "plateNumber", "feePaisa"]).default("checkedOutAt"), sortOrder: z.enum(["asc", "desc"]).default("desc") }).parse(request.query);
  const where = { garageId: request.user!.garageId, status: states.SessionStatus.COMPLETED, ...(query.search ? { plateNumber: { contains: normalizePlate(query.search) } } : {}) };
  const [items, total] = await Promise.all([prisma.parkingSession.findMany({ where, include: { spot: true }, orderBy: { [query.sortBy]: query.sortOrder }, skip: (query.page - 1) * query.pageSize, take: query.pageSize }), prisma.parkingSession.count({ where })]);
  response.json({ items, pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) }, sorting: { sortBy: query.sortBy, sortOrder: query.sortOrder } });
} catch (error) { next(error); } });
appRouter.post("/clock", async (request: AuthRequest, response, next) => { try { const now = z.object({ now: z.coerce.date() }).parse(request.body).now; const overdue = await prisma.parkingSession.findMany({ where: { garageId: request.user!.garageId, status: states.SessionStatus.ACTIVE, checkedInAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } }); const closed = []; for (const session of overdue) closed.push(await closeSession(session.id, request.user!.garageId, now)); response.json({ now, autoClosed: closed.length, sessions: closed }); } catch (error) { next(error); } });
