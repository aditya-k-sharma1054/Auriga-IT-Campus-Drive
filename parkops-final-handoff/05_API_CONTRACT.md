# ParkOps — REST API Contract

## 1. Base

All application APIs use:

```text
/api/v1
```

Content type:

```text
application/json
```

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

## 2. Common error shape

```json
{
  "error": {
    "code": "SPOT_UNAVAILABLE",
    "message": "No compatible parking spot is currently available."
  }
}
```

No stack traces or password hashes are returned to clients.

## 3. Authentication

### POST `/api/v1/auth/register`

Request:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "StrongPassword123",
  "garageName": "Central City Garage",
  "garageAddress": "Jaipur"
}
```

Response 201:

```json
{
  "user": {
    "id": "...",
    "name": "Alex",
    "email": "alex@example.com",
    "garageId": "..."
  },
  "token": "..."
}
```

### POST `/api/v1/auth/login`

Request:

```json
{
  "email": "alex@example.com",
  "password": "StrongPassword123"
}
```

Response 200:

```json
{
  "user": {
    "id": "...",
    "name": "Alex",
    "email": "alex@example.com",
    "garageId": "..."
  },
  "token": "..."
}
```

### GET `/api/v1/auth/me`

Returns the authenticated user context.

## 4. Dashboard

### GET `/api/v1/dashboard/summary`

Response:

```json
{
  "totalSpots": 30,
  "occupiedSpots": 12,
  "availableSpots": 18,
  "evTotal": 6,
  "evAvailable": 4,
  "activeSessions": 12
}
```

## 5. Garage

### GET `/api/v1/garage`

Returns current garage details and pricing.

### PUT `/api/v1/garage`

Optional management endpoint. Allows updating name, address and pricing.

Request:

```json
{
  "name": "Central City Garage",
  "address": "Jaipur",
  "firstHourRatePaisa": 5000,
  "additionalHourRatePaisa": 3000,
  "dailyCapPaisa": 25000
}
```

## 6. Spots

### GET `/api/v1/spots`

Supported query parameters:

```text
type=COMPACT|STANDARD|EV
status=AVAILABLE|OCCUPIED
floor=1
page=1
pageSize=10
sortBy=floor|number|status
sortOrder=asc|desc
```

Return paginated data if pagination parameters are used.

### GET `/api/v1/spots/availability?type=EV`

Returns availability summary and matching spots.

Response example:

```json
{
  "type": "EV",
  "total": 6,
  "available": 4,
  "spots": [
    { "id": "...", "floor": 1, "number": "EV-01", "status": "AVAILABLE" }
  ]
}
```

### POST `/api/v1/spots`

Optional inventory-management endpoint. Must be authenticated and garage-scoped.

Request:

```json
{
  "floor": 2,
  "number": "EV-11",
  "type": "EV"
}
```

## 7. Parking

### POST `/api/v1/parking/check-in`

Request:

```json
{
  "plateNumber": "RJ14 AB-1234",
  "vehicleType": "EV"
}
```

Success 201:

```json
{
  "session": {
    "id": "...",
    "plateNumber": "RJ14AB1234",
    "vehicleType": "EV",
    "status": "ACTIVE",
    "checkedInAt": "2026-09-17T10:42:00.000Z"
  },
  "spot": {
    "id": "...",
    "floor": 2,
    "number": "EV-04",
    "type": "EV"
  }
}
```

Possible errors:

- `DUPLICATE_ACTIVE_SESSION` → 409
- `SPOT_UNAVAILABLE` → 409
- `VALIDATION_ERROR` → 400

### GET `/api/v1/parking/active`

Optional query parameters:

```text
page
pageSize
sortBy=checkedInAt|plateNumber
sortOrder=asc|desc
```

### GET `/api/v1/parking/search?plate=RJ14AB1234`

Searches active sessions using normalized plate text.

Response:

```json
{
  "items": [
    {
      "id": "...",
      "plateNumber": "RJ14AB1234",
      "vehicleType": "EV",
      "checkedInAt": "...",
      "spot": {
        "floor": 2,
        "number": "EV-04",
        "type": "EV"
      }
    }
  ]
}
```

### POST `/api/v1/parking/:sessionId/check-out`

No client timestamp is accepted.

Server uses current time.

Success 200:

```json
{
  "session": {
    "id": "...",
    "plateNumber": "RJ14AB1234",
    "checkedInAt": "...",
    "checkedOutAt": "...",
    "status": "COMPLETED"
  },
  "billing": {
    "durationMinutes": 134,
    "billableHours": 3,
    "feePaisa": 11000,
    "feeDisplay": "₹110"
  },
  "releasedSpot": {
    "floor": 2,
    "number": "EV-04"
  }
}
```

Possible errors:

- `SESSION_NOT_FOUND` → 404
- `SESSION_NOT_ACTIVE` → 409

## 8. History

### GET `/api/v1/parking/history`

Query:

```text
page=1
pageSize=10
search=RJ14
sortBy=checkedInAt|checkedOutAt|plateNumber|feePaisa
sortOrder=asc|desc
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 42,
    "totalPages": 5
  },
  "sorting": {
    "sortBy": "checkedInAt",
    "sortOrder": "desc"
  }
}
```

## 9. API rules

- No client-provided `garageId` for protected operations.
- Do not return passwordHash.
- Validate all body/query parameters with Zod.
- Use an allow-list for sort fields.
- Apply pagination in the database query.
- Never accept raw SQL or arbitrary `ORDER BY` values.
- Use appropriate status codes.
