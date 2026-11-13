# C-GUARD
### Corps Member Journey Safety & Emergency Response System

**Every Journey Matters. Every Life Counts.**

C-GUARD is an independent technology initiative designed to improve journey visibility, emergency reporting, and incident response for National Youth Service Corps (NYSC) members travelling to their assigned orientation camps.

The platform enables corps members to register journeys, share location updates during active trips, and request emergency assistance through an SOS feature. Authorized monitoring personnel can view active journeys, receive alerts, assess potential risks, and coordinate appropriate responses through a centralized dashboard.

> **Project status:** Initial development / MVP  
> **Initial target:** NYSC corps members travelling to orientation camps  
> **Platform:** Android mobile application and web-based monitoring dashboard

---

## 1. The Problem

Corps members travel from different parts of Nigeria to their assigned orientation camps. During these journeys, limited visibility into their whereabouts can make it difficult for designated personnel and emergency contacts to respond promptly when something goes wrong.

C-GUARD aims to address this challenge through:

- Journey registration and monitoring.
- Periodic location updates during active journeys.
- Emergency SOS reporting.
- Detection of unusual journey patterns.
- Centralized incident management.
- Reliable location synchronization during network interruptions.

## 2. Proposed Solution

C-GUARD consists of three primary components:

1. **Mobile Application:** Used by corps members to register journeys, share location updates, and request emergency assistance.
2. **Backend System:** Processes journey data, manages users and incidents, evaluates risk indicators, and coordinates communication between applications.
3. **Monitoring Dashboard:** Used by authorized personnel to monitor active journeys, review alerts, and manage incidents.

The platform is designed to support informed human decision-making. Automated alerts indicate potential concerns; they do not independently establish that kidnapping or another emergency has occurred.

## 3. Core Features

### Corps Member Mobile Application

- Secure authentication.
- Corps member profile.
- Assigned orientation camp information.
- Journey registration.
- Journey activation and completion.
- Background location tracking during active journeys.
- SOS emergency reporting.
- Emergency contact information.
- Offline location storage.
- Automatic synchronization when connectivity returns.
- Journey status and history.

### Monitoring Dashboard

- Secure personnel authentication.
- Active journey overview.
- Live journey map.
- Corps member information.
- Journey history.
- Risk and emergency alerts.
- Incident management.
- Incident acknowledgement and escalation.
- Incident resolution records.
- Activity and audit logs.

### Backend System

- Authentication and authorization.
- Journey lifecycle management.
- Location ingestion and processing.
- Offline synchronization support.
- Risk assessment engine.
- Incident management.
- Notification management.
- Real-time dashboard updates.
- Audit logging.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Mobile application | Flutter / Dart |
| State management | Riverpod |
| Navigation | GoRouter |
| API communication | Dio |
| Local database | Drift / SQLite |
| Secure local storage | Flutter Secure Storage |
| Location services | Geolocator |
| Android background tracking | Flutter Foreground Task + native Android integration where required |
| Backend | Node.js / Express |
| Backend language | JavaScript or TypeScript |
| Database | PostgreSQL |
| Geospatial operations | PostGIS |
| Caching and background jobs | Redis |
| Dashboard | Next.js / React |
| Dashboard language | TypeScript |
| Real-time communication | WebSockets |
| Error monitoring | Sentry |

## 5. System Architecture

```text
                    C-GUARD PLATFORM

       ┌──────────────────────────────┐
       │       Flutter Mobile         │
       │                              │
       │  Authentication              │
       │  Journey Management          │
       │  Location Tracking           │
       │  SOS Emergency Reporting     │
       │  Offline Storage             │
       └──────────────┬───────────────┘
                      │
                 HTTPS / REST
                      │
       ┌──────────────▼───────────────┐
       │       Node.js Backend        │
       │                              │
       │  Authentication              │
       │  Journey Management          │
       │  Location Processing         │
       │  Risk Assessment             │
       │  Incident Management         │
       │  Notifications               │
       └──────────────┬───────────────┘
                      │
             ┌────────┴────────┐
             │                 │
     ┌───────▼───────┐  ┌──────▼───────┐
     │ PostgreSQL    │  │    Redis     │
     │ + PostGIS     │  │              │
     └───────────────┘  └──────────────┘
                      │
                WebSockets
                      │
       ┌──────────────▼───────────────┐
       │      Next.js Dashboard      │
       │                              │
       │  Active Journeys             │
       │  Live Monitoring Map         │
       │  Alerts and Incidents        │
       │  Personnel Management        │
       │  Audit Logs                  │
       └──────────────────────────────┘
```

## 6. Mobile Application Structure

The Flutter application follows a feature-first architecture.

```text
mobile/
└── lib/
    ├── main.dart
    ├── app/
    │   ├── app.dart
    │   ├── router.dart
    │   └── providers.dart
    │
    ├── core/
    │   ├── constants/
    │   ├── errors/
    │   ├── network/
    │   ├── storage/
    │   ├── location/
    │   └── utils/
    │
    ├── features/
    │   ├── authentication/
    │   ├── journey/
    │   ├── tracking/
    │   ├── emergency/
    │   └── profile/
    │
    └── shared/
        ├── widgets/
        └── models/
```

Each feature is separated into:

- `data/` — Data sources, models, repositories.
- `domain/` — Business logic and entities.
- `presentation/` — Screens, widgets, and state management.

## 7. Journey Lifecycle

A typical journey follows this sequence:

1. Corps member authenticates.
2. Corps member confirms their assigned orientation camp.
3. Corps member registers journey details.
4. Corps member grants the required location permissions.
5. Corps member starts the journey.
6. The application begins periodic location updates.
7. The backend receives and processes location information.
8. Authorized personnel monitor the journey.
9. An SOS or potential risk alert creates an incident for assessment.
10. The corps member confirms arrival and completes the journey.

## 8. Location Monitoring and Offline Support

Location monitoring is activated only during an explicitly registered and active journey.

The mobile application periodically captures relevant location information, including:

- Latitude and longitude.
- Location accuracy.
- Timestamp.
- Speed, when available.
- Heading, when available.
- Device and connectivity status where necessary.

### Offline-first strategy

When connectivity is unavailable:

1. Location events are saved in the local SQLite database.
2. Events are marked as pending synchronization.
3. The application retries synchronization when connectivity returns.
4. The backend validates and acknowledges received events.
5. Successfully synchronized events are marked accordingly.

Location events should have unique identifiers to support idempotent uploads and prevent duplicate records.

## 9. Emergency and Risk Management

C-GUARD supports two primary emergency mechanisms:

**Manual SOS**

The corps member can request emergency assistance through the mobile application.

**Automated risk indicators**

The backend can flag unusual patterns, including:

- Unexpected prolonged stops.
- Significant route deviations.
- Extended communication loss.
- Multiple correlated alerts from members travelling together.

Risk assessment must consider multiple signals and their reliability. A stationary GPS reading alone must never be treated as proof of an emergency.

All incidents require appropriate human assessment and follow established response procedures.

## 10. Security and Privacy

Because C-GUARD processes sensitive personal and location information, security and privacy are foundational requirements.

The system should implement:

- Secure authentication.
- Role-based access control.
- Encryption in transit and at rest.
- Secure token storage.
- Restricted access to location history.
- Audit logging for sensitive operations.
- Data minimization.
- Defined data-retention policies.
- Secure API authorization.
- Transparency about location collection and usage.

Access must be limited to authorized personnel under formally approved institutional policies.

Real-world deployment requires institutional authorization, appropriate privacy and legal review, security testing, and documented emergency-response procedures.

## 11. Development Roadmap

### Phase 1 — Foundation
- [ ] Repository and project setup.
- [ ] Backend project initialization.
- [ ] Database configuration.
- [ ] Mobile application foundation.
- [ ] Dashboard foundation.
- [ ] Authentication.

### Phase 2 — Journey Management
- [ ] Corps member profiles.
- [ ] Orientation camp management.
- [ ] Journey registration.
- [ ] Journey activation.
- [ ] Journey completion.

### Phase 3 — Location Tracking
- [ ] Location permission management.
- [ ] Background location service.
- [ ] Periodic location updates.
- [ ] Offline location storage.
- [ ] Synchronization mechanism.

### Phase 4 — Emergency Management
- [ ] SOS functionality.
- [ ] Incident creation.
- [ ] Incident acknowledgement.
- [ ] Incident escalation.
- [ ] Risk assessment engine.
- [ ] Emergency notifications.

### Phase 5 — Monitoring Dashboard
- [ ] Active journey overview.
- [ ] Live monitoring map.
- [ ] Journey details.
- [ ] Alert management.
- [ ] Incident management.
- [ ] Audit logs.

### Phase 6 — Testing and Evaluation
- [ ] Mobile background tracking tests.
- [ ] Offline synchronization tests.
- [ ] API security tests.
- [ ] Simulated journey tests.
- [ ] Load and performance tests.
- [ ] Controlled institutional pilot evaluation.

## 12. Testing Strategy

Before any real-world deployment, the system should be evaluated using simulated journeys and controlled test accounts.

Important test scenarios include:

- Normal journey movement.
- Planned stops.
- Unexpected prolonged stops.
- Route deviations.
- GPS unavailability.
- Network interruptions.
- Battery-related interruptions.
- Manual SOS requests.
- Multiple simultaneous incidents.
- Large numbers of concurrent active journeys.

Performance testing should evaluate location ingestion, alert delivery, dashboard responsiveness, and synchronization reliability.

## 13. Project Scope

The initial version is specifically focused on corps members travelling to NYSC orientation camps.

It is not intended to be a general-purpose tracking application or a replacement for emergency services and established security-response institutions.

Future expansion will be considered only after the NYSC-focused product has been evaluated.

## 14. Project Status

C-GUARD is currently in its initial development stage.

The first objective is to build a functional MVP demonstrating the complete journey lifecycle, reliable location collection, SOS reporting, and centralized incident monitoring.

The initial prototype should use simulated data until the necessary institutional approvals and safeguards are established.

---

**C-GUARD**  
*Every Journey Matters. Every Life Counts.*