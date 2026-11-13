# C-GUARD Backend — Master Development Prompt

## 1. Project Overview

Build the backend for **C-GUARD (Corps Member Journey Safety & Emergency Response System)**.

C-GUARD is an independent technology product designed to help monitor the journeys of NYSC corps members travelling to their assigned orientation camps.

The system consists of three major components:

1. **Mobile application:** Flutter application used by corps members to register journeys, share location during active journeys, receive updates, and send emergency alerts.
2. **Backend:** Node.js API responsible for authentication, journey management, location tracking, risk indicators, SOS reports, incidents, notifications, and data management.
3. **Admin dashboard:** Next.js web application used by authorized personnel to monitor active journeys, review alerts, and manage incidents.

The backend must provide secure, reliable, and well-structured APIs for the mobile application and dashboard.

C-GUARD is initially an independent product intended for possible institutional adoption. Do not represent it as an officially approved NYSC system.

---

## 2. Technology Stack

Use the following technologies:

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| Database driver | `pg` (node-postgres) |
| Validation | Zod |
| Authentication | JWT |
| Password hashing | Argon2 |
| Geographic calculations | Geolib |
| Real-time communication | Socket.IO |
| Logging | Pino |
| Security headers | Helmet |
| CORS | cors |
| Testing | Vitest |
| API testing | Supertest |

### Important technology restrictions

Do not introduce the following:

- No ORM or query builder. Use raw SQL through `pg`.
- No PostGIS.
- No Redis.
- No BullMQ.
- No message brokers.
- No microservices.
- No unnecessary architectural frameworks.

Use PostgreSQL's normal numeric columns for latitude and longitude. Use `geolib` for basic distance and proximity calculations.

Turf.js may be considered later if advanced geographic geometry becomes necessary, but it is not required for the MVP.

Keep the implementation simple, modular, testable, and production-conscious.

---

## 3. Architecture

Use a **modular monolithic architecture**.

The application should run as one backend service, but its features must be separated into independent modules.

Each module should have clear responsibilities and communicate through service interfaces rather than directly accessing another module's database implementation.

Use dependency injection through explicit constructors and module composition where appropriate. Avoid unnecessary abstractions.

### General request flow

Route → Middleware → Controller → Service → Repository → PostgreSQL

Responsibilities:

- **Routes:** Define HTTP endpoints and attach middleware.
- **Middleware:** Handle authentication, authorization, validation, rate limiting, and other cross-cutting concerns.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain business logic and coordinate operations.
- **Repositories:** Handle database queries using raw SQL.
- **Validation:** Define and enforce request schemas with Zod.
- **Types:** Define module-specific TypeScript types.
- **Mappers:** Convert database records into appropriate response objects when needed.

Controllers must not contain business logic or SQL queries.

Services must not directly depend on Express request or response objects.

Repositories must not return HTTP responses.

Never expose raw database records directly to API consumers.

---

## 4. Project Structure

Use this directory structure:

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── cors.ts
│   │   └── socket.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── errors/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── corps-members/
│   │   ├── personnel/
│   │   ├── roles/
│   │   ├── camps/
│   │   ├── journeys/
│   │   ├── tracking/
│   │   ├── emergencies/
│   │   ├── incidents/
│   │   ├── notifications/
│   │   └── dashboard/
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── migration-runner.ts
│   │   └── realtime/
│   │
│   └── routes/
│       └── index.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Each feature module should follow a consistent structure.

Example:

```text
journeys/
├── journey.routes.ts
├── journey.controller.ts
├── journey.service.ts
├── journey.repository.ts
├── journey.validation.ts
├── journey.types.ts
└── journey.mapper.ts
```

Do not create unnecessary files if a module does not need them.

---

## 5. Core Backend Modules

### A. Authentication

Responsible for authentication and session management.

Features:

- Corps member registration.
- Personnel login.
- Corps member login.
- Logout.
- Refresh access tokens.
- Retrieve authenticated user information.
- Password hashing using Argon2.
- Token rotation and revocation.
- Account status management.

Requirements:

- Use short-lived access tokens.
- Use securely managed refresh tokens.
- Store refresh tokens securely, preferably as hashes.
- Revoke refresh tokens on logout.
- Validate all authentication inputs.
- Prevent unauthorized account access.

Personnel accounts should be created or provisioned through authorized administrative processes rather than unrestricted public registration.

### B. Users

Manage shared user information.

Features:

- Retrieve user profile.
- Update permitted profile fields.
- Retrieve account status.
- Manage account activation and deactivation.

Keep authentication credentials separate from general profile information where appropriate.

### C. Corps Members

Manage corps member-specific information.

Features:

- Corps member profile.
- Call-up number.
- State code.
- Assigned orientation camp.
- Emergency contact information.
- Journey history.
- Account status.

A corps member should only access their own private profile and journey information.

### D. Personnel and Roles

Manage authorized dashboard users.

Potential roles:

- System Administrator
- Operations Administrator
- Monitoring Officer
- Incident Officer
- Read-Only Viewer

Implement role-based access control (RBAC).

Permissions must determine which operations a user can perform.

For example:

- A monitoring officer may view authorized active journeys.
- An incident officer may manage assigned incidents.
- A system administrator may manage accounts and roles.
- A read-only viewer may view permitted information without modifying records.

Do not rely on frontend restrictions for authorization. Enforce permissions on the backend.

### E. Camps

Manage NYSC orientation camp information.

Features:

- Create camp.
- Update camp information.
- Retrieve camp details.
- List available camps.
- Store camp name, address, state, and coordinates.
- Assign corps members to camps.

Store coordinates using normal PostgreSQL numeric columns.

### F. Journeys

This module manages the journey lifecycle.

Features:

- Register a journey.
- Retrieve journey details.
- Retrieve a corps member's journey history.
- Start a journey.
- End a journey.
- Cancel a journey.
- Retrieve an active journey.

A journey should contain information such as:

- Journey ID.
- Corps member ID.
- Origin.
- Destination.
- Assigned camp.
- Planned departure time.
- Journey status.
- Actual start time.
- Actual end time.
- Created and updated timestamps.

Possible journey statuses:

- Scheduled
- Active
- Completed
- Cancelled

Business rules:

- A corps member should not have multiple active journeys unless explicitly supported by a defined business rule.
- Only the journey owner or authorized personnel may perform permitted journey operations.
- A journey must follow valid state transitions.
- Location tracking should only be accepted for an eligible active journey.
- Ending or cancelling a journey should update its tracking state appropriately.

Use database transactions for operations that require multiple related database changes.

### G. Tracking

Responsible for receiving and storing location updates from the Flutter application.

Features:

- Receive GPS location updates.
- Store journey location history.
- Retrieve the latest location.
- Retrieve location history.
- Support offline location synchronization.
- Publish authorized real-time updates to the dashboard.

A location record may contain:

```text
id
journey_id
event_id
latitude
longitude
accuracy_m
speed_mps
heading_deg
recorded_at
received_at
```

Use:

- `latitude` and `longitude` as numeric columns.
- `accuracy_m` to represent GPS accuracy.
- `recorded_at` for the timestamp generated by the device.
- `received_at` for the timestamp received by the backend.
- `event_id` as a unique identifier for an uploaded location event.

#### Geographic calculations

Use `geolib` for basic calculations, including:

- Distance between two coordinates.
- Distance from a corps member to a destination.
- Basic proximity checks.

Do not implement geographic calculations as proof of an emergency or criminal activity.

GPS data can be inaccurate, delayed, unavailable, or inconsistent.

#### Offline synchronization

The mobile application may temporarily lose internet connectivity.

The backend must support batch synchronization of previously collected location events.

Requirements:

- Accept batches of location records.
- Validate every record.
- Use unique event IDs to prevent duplicate insertion.
- Preserve device-recorded timestamps.
- Record server receipt timestamps.
- Handle duplicate events safely.
- Return a clear synchronization result.

Use database constraints and transactions where appropriate.

#### Database indexes

Create indexes that support common tracking queries, particularly:

- Retrieving a journey's location history by timestamp.
- Retrieving the latest location for a journey.
- Preventing duplicate event IDs within the appropriate scope.

Do not introduce PostGIS for these MVP requirements.

### H. Emergencies

Responsible for receiving SOS reports.

Features:

- Submit an SOS request.
- Associate the request with an active journey.
- Capture the latest available location.
- Record the submission timestamp.
- Create an incident.
- Notify authorized personnel through approved notification channels.
- Retrieve emergency submission history.

The SOS endpoint must be reliable and carefully protected.

Requirements:

- Prevent unauthorized SOS submissions for another user's journey.
- Validate the journey and account status.
- Handle repeated submissions without creating uncontrolled duplicate incidents.
- Record whether the location is current or the last available location.
- Never claim that an SOS has been delivered to responders unless the backend confirms successful processing.

### I. Incidents

Responsible for incident management by authorized personnel.

Features:

- List incidents.
- Retrieve incident details.
- Acknowledge an incident.
- Assign an incident.
- Escalate an incident.
- Add incident notes.
- Resolve an incident.
- Close an incident.
- Retrieve incident history.

Possible incident statuses:

- New
- Acknowledged
- Assigned
- Escalated
- Resolved
- Closed

Maintain an incident event history.

Every sensitive incident action should be recorded in the audit log.

Automated risk indicators must be treated as indicators requiring human review, not confirmed emergencies.

Potential indicators may include:

- Unexpected prolonged stops.
- Significant route deviations.
- Extended communication loss.
- Multiple correlated warning signals.
- Manual SOS submissions.

A single GPS anomaly, stationary location, or loss of connectivity must not automatically be interpreted as proof of kidnapping or another crime.

### J. Notifications

Responsible for managing notification records and delivery integrations.

MVP features:

- Create notification records.
- Retrieve notifications.
- Mark notifications as read.
- Associate notifications with users or authorized personnel.
- Provide a notification service interface.

Keep notification providers abstracted so that push notification services can be integrated later.

Do not introduce a message broker or external queue for the MVP.

### K. Dashboard

Provide APIs for the Next.js monitoring dashboard.

Features:

- Overview statistics.
- Active journeys.
- Latest available locations.
- Journey details.
- Alerts.
- Incident management.
- Recent incident history.
- Corps member information.
- Camp information.

Support pagination, filtering, sorting, and permission checks.

The dashboard must only receive information the authenticated personnel are authorized to access.

---

## 6. Database Design

Use PostgreSQL with raw SQL through `pg`.

Do not use an ORM.

Use UUID primary keys, foreign keys, appropriate constraints, and database transactions.

Proposed tables:

| Table | Purpose |
|---|---|
| users | Shared user accounts |
| corps_members | Corps member profiles |
| personnel | Personnel-specific profiles |
| roles | Available system roles |
| permissions | Individual permissions |
| role_permissions | Role-permission relationships |
| user_roles | User-role relationships |
| camps | Orientation camp information |
| journeys | Journey records |
| journey_locations | GPS location history |
| emergency_contacts | Corps member emergency contacts |
| incidents | Emergency and incident records |
| incident_events | Incident activity history |
| notifications | Notification records |
| refresh_tokens | Refresh token management |
| audit_logs | Sensitive action history |

### Database requirements

- Use UUIDs for primary keys.
- Use foreign keys for relational integrity.
- Use `TIMESTAMPTZ` for timestamps.
- Store timestamps in UTC.
- Use appropriate unique constraints.
- Add indexes for frequent queries.
- Use parameterized SQL queries.
- Use transactions for multi-step operations.
- Avoid returning unnecessary sensitive fields.
- Include `created_at` and `updated_at` where appropriate.

### Location storage

For MVP, store coordinates using PostgreSQL numeric types.

For example:

```sql
latitude DOUBLE PRECISION NOT NULL,
longitude DOUBLE PRECISION NOT NULL
```

Use appropriate validation to ensure coordinates are within valid geographic ranges.

Do not add PostGIS extensions or spatial column types.

### Migrations

Implement a simple SQL migration system.

Requirements:

- Store migrations as `.sql` files.
- Track executed migrations in a migrations table.
- Execute migrations in a controlled order.
- Prevent accidental duplicate migration execution.
- Support database initialization and seed data.

Do not use an ORM migration system.

---

## 7. API Design

Use:

```text
/api/v1
```

All endpoints should follow consistent response and error formats.

### Authentication

```http
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
```

### Corps Members

```http
GET    /corps-members/me
PATCH  /corps-members/me

GET    /corps-members/me/emergency-contacts
POST   /corps-members/me/emergency-contacts

PATCH  /emergency-contacts/:id
DELETE /emergency-contacts/:id
```

### Camps

```http
GET    /camps
GET    /camps/:id
POST   /camps
PATCH  /camps/:id
```

### Journeys

```http
POST   /journeys
GET    /journeys
GET    /journeys/active
GET    /journeys/:id

POST   /journeys/:id/start
POST   /journeys/:id/end
POST   /journeys/:id/cancel
```

### Tracking

```http
POST   /journeys/:id/locations
POST   /journeys/:id/locations/sync

GET    /journeys/:id/locations
GET    /journeys/:id/locations/latest
```

### Emergencies

```http
POST   /journeys/:id/sos
```

### Incidents

```http
GET    /incidents
GET    /incidents/:id

POST   /incidents/:id/acknowledge
POST   /incidents/:id/assign
POST   /incidents/:id/escalate
POST   /incidents/:id/notes
POST   /incidents/:id/resolve
POST   /incidents/:id/close
```

### Dashboard

```http
GET    /dashboard/overview
GET    /dashboard/active-journeys
GET    /dashboard/alerts
GET    /dashboard/recent-incidents
```

All routes must enforce authentication, authorization, validation, and appropriate error handling.

---

## 8. Real-Time Communication

Use Socket.IO for real-time communication between the backend and dashboard.

Potential real-time events:

```text
journey:location_updated
journey:status_changed
alert:created
incident:created
incident:updated
notification:created
```

Requirements:

- Authenticate socket connections.
- Enforce role-based access.
- Restrict users to authorized event channels or rooms.
- Do not broadcast sensitive information to every connected client.
- Validate event payloads.
- Handle disconnected clients.
- Ensure the dashboard can recover by fetching the latest data through REST APIs.

Use in-process Socket.IO communication for the MVP.

Do not introduce Redis adapters or external message brokers.

Keep the real-time implementation modular so that it can be scaled later if actual deployment requirements justify it.

---

## 9. Security Requirements

Security is a core requirement because the application processes personal information and location data.

Implement:

### Authentication and authorization

- Argon2 password hashing.
- Secure access and refresh token handling.
- Token rotation and revocation.
- Role-based access control.
- Resource ownership checks.
- Account status checks.
- Restricted personnel account provisioning.

### API security

- Helmet.
- CORS allowlist.
- Zod request validation.
- Rate limiting.
- Parameterized SQL.
- Centralized error handling.
- Secure environment variable management.
- No sensitive information in production error responses.

### Location privacy

- Collect location only during an explicitly activated journey and under the approved product policy.
- Clearly communicate when tracking is active.
- Restrict location access to authorized users.
- Encrypt data in transit and at rest.
- Avoid unnecessary location collection and retention.
- Define a retention and deletion policy.
- Record access to sensitive journey information.
- Do not expose precise location data in unnecessary logs.

### Audit logging

Record sensitive actions such as:

- Personnel login and administrative changes.
- Role and permission changes.
- Journey access by authorized personnel.
- Incident acknowledgement and assignment.
- Incident escalation and resolution.
- Access to sensitive records where required.

Do not log passwords, tokens, or unnecessary sensitive personal information.

---

## 10. Error Handling and API Responses

Create a centralized error-handling system.

Use a consistent success response format, for example:

```json
{
  "success": true,
  "message": "Journey retrieved successfully",
  "data": {}
}
```

Use a consistent error response format:

```json
{
  "success": false,
  "message": "Invalid request",
  "errors": []
}
```

Use appropriate HTTP status codes.

Examples:

- `200` — Successful request.
- `201` — Resource created.
- `400` — Invalid request.
- `401` — Unauthenticated.
- `403` — Unauthorized.
- `404` — Resource not found.
- `409` — Resource conflict.
- `422` — Validation failure, where appropriate.
- `429` — Rate limit exceeded.
- `500` — Internal server error.

Never expose internal stack traces or database errors in production responses.

---

## 11. Testing

Use Vitest and Supertest.

Write unit tests for business logic and integration tests for API and database operations.

Prioritize tests for:

- Authentication.
- Password hashing.
- Token refresh and revocation.
- Role-based access control.
- Journey creation and state transitions.
- Journey ownership.
- Location validation.
- Duplicate location event handling.
- Offline batch synchronization.
- SOS submission.
- Incident lifecycle.
- Permission enforcement.
- Error handling.

Test both successful and unsuccessful scenarios.

Use a separate test database or isolated test setup.

Do not use real corps member information or real emergency contacts in test data.

---

## 12. Development Milestones

Build the backend incrementally.

Do not attempt to implement the entire backend at once.

Complete and verify each milestone before moving to the next.

### Milestone 1: Project Foundation

Implement:

- Node.js and TypeScript setup.
- Express application setup.
- Environment configuration.
- PostgreSQL connection using `pg`.
- Centralized logging with Pino.
- Centralized error handling.
- CORS configuration.
- Helmet.
- Basic rate limiting.
- Health-check endpoint.
- Project folder structure.

Expected result:

A working Express server connected to PostgreSQL with a clean project structure and basic security configuration.

### Milestone 2: Database Foundation

Implement:

- SQL migration runner.
- Initial database schema.
- Foreign keys and constraints.
- Database indexes.
- Seed scripts.
- Database transaction helper.

Expected result:

A properly structured and initialized PostgreSQL database.

### Milestone 3: Authentication and Authorization

Implement:

- Registration.
- Login.
- Password hashing.
- JWT access tokens.
- Refresh token rotation.
- Logout.
- Authentication middleware.
- RBAC middleware.
- Role and permission management.

Expected result:

Secure authentication and authorization for corps members and personnel.

### Milestone 4: Profiles and Camps

Implement:

- Corps member profiles.
- Personnel profiles.
- Emergency contacts.
- Camp management.
- Camp assignment.

Expected result:

Authenticated users can access their permitted profile information, and authorized personnel can manage camp records.

### Milestone 5: Journey Management

Implement:

- Journey registration.
- Journey retrieval.
- Journey history.
- Journey start.
- Journey completion.
- Journey cancellation.
- Journey state validation.

Expected result:

A complete journey lifecycle.

### Milestone 6: Location Tracking

Implement:

- Location ingestion.
- Location history.
- Latest location retrieval.
- Batch synchronization.
- Duplicate event protection.
- Geolib integration for basic geographic calculations.
- Real-time location updates through Socket.IO.

Expected result:

The Flutter application can submit location events and the authorized dashboard can retrieve updates.

### Milestone 7: Emergencies and Incidents

Implement:

- SOS submission.
- Incident creation.
- Incident acknowledgement.
- Incident assignment.
- Incident escalation.
- Incident notes.
- Incident resolution.
- Incident event history.
- Audit logging.

Expected result:

A complete, auditable emergency and incident management workflow.

### Milestone 8: Notifications and Dashboard APIs

Implement:

- Notification records.
- Notification retrieval.
- Read status.
- Dashboard overview.
- Active journey APIs.
- Alert APIs.
- Recent incident APIs.
- Socket.IO authorization and event handling.

Expected result:

The Next.js dashboard can retrieve and receive authorized operational updates.

### Milestone 9: Testing and Hardening

Implement:

- Unit tests.
- Integration tests.
- API validation.
- Authorization checks.
- Rate limiting review.
- Database query optimization.
- Error-handling review.
- Security review.
- Documentation.

Expected result:

A tested MVP backend ready for controlled demonstration and further review.

---

## 13. Code Quality Rules

Follow these rules throughout development:

1. Use TypeScript strictly.
2. Avoid `any` unless there is a justified reason.
3. Keep controllers thin.
4. Keep business logic inside services.
5. Keep SQL queries inside repositories.
6. Use parameterized SQL exclusively.
7. Validate incoming data using Zod.
8. Use transactions for operations requiring atomicity.
9. Use meaningful names.
10. Avoid unnecessary abstractions.
11. Avoid duplicated business logic.
12. Keep modules independent and maintainable.
13. Use dependency injection where it improves testability.
14. Never expose database implementation details through API responses.
15. Write tests alongside important business logic.

Do not overengineer the MVP.

---

## 14. Important Implementation Instructions

Before writing code:

1. Inspect the existing project structure.
2. Identify the current milestone.
3. Review the relevant requirements.
4. Explain the implementation approach briefly.
5. Implement only the current milestone.
6. Explain the files created or modified.
7. Provide commands required to run and test the implementation.
8. Verify the implementation before proceeding.

Do not silently skip requirements.

Do not introduce additional packages without explaining why they are necessary.

Do not implement future milestones prematurely.

If a requirement is ambiguous, identify the ambiguity and recommend a practical solution before implementing it.

When finished with a milestone, provide:

- What was implemented.
- Important architectural decisions.
- Files created or modified.
- Packages installed.
- Commands to run.
- Tests performed and their results.
- Any known limitations.
- The next recommended milestone.

---

## 15. First Task

**Begin with Milestone 1: Project Foundation only.**

Set up the Node.js and TypeScript backend using Express.

Configure:

- TypeScript.
- Express.
- PostgreSQL connection using `pg`.
- Environment variables.
- Pino logging.
- Centralized error handling.
- Helmet.
- CORS.
- Rate limiting.
- Health-check endpoint.

Create the required foundation folder structure.

Do not implement authentication, database tables, journeys, tracking, incidents, or other feature modules yet.

First explain the setup approach and proposed dependencies. Then implement Milestone 1.

The goal is to establish a clean, reliable foundation before adding business functionality.