# PulseCart Infrastructure Lab

Scalable commerce backend concept for checkout, inventory reservation, payment webhooks and failure recovery.

## Recruiter Signal

- Backend fundamentals through API design, idempotency and data consistency.
- Distributed workflow thinking around queues, retries and external payment events.
- Practical architecture documentation for real production edge cases.

## Suggested Architecture

- Node.js and Express API.
- MongoDB collections for carts, reservations, orders and webhook events.
- Queue worker for payment confirmation, fulfillment and retry handling.
- Docker Compose environment for local service orchestration.
- Structured logs and health endpoints for operational visibility.

## Core Features

- Idempotent checkout endpoint to prevent duplicate order creation.
- Inventory reservation flow with expiration and release logic.
- Retry-safe webhook processor for payment status changes.
- Cart validation and pricing snapshot before order creation.
- Failure-mode documentation for timeouts, partial payments and stale carts.

## Portfolio Story

This project demonstrates that I understand the backend work behind smooth user experiences: reliable APIs, careful state transitions and graceful handling when external systems fail.
