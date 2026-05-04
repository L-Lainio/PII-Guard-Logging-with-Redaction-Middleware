
# PII‑Guard: Logging with Redaction Middleware

## 🏷️ Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Library-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Dev%20Container-Docker-2496ED?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18)
![ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?logo=eslint&logoColor=white)
**PII‑Guard** is a **TypeScript‑first redaction middleware** designed to prevent
personally identifiable information (PII) and secrets from leaking into logs
and structured payloads.

It is built with a **security‑first mindset**, emphasizing safe defaults,
runtime validation boundaries, and reusable tooling suitable for
compliance‑aware systems.

---

## ✨ Features

- Redacts PII from **plain text logs** and **structured objects**
- Type‑safe, strict TypeScript API
- Configurable redaction modes:
  - placeholder
  - mask
  - remove
  - tokenized
- Designed for **logging pipelines**, not business logic
- Zero telemetry — runs entirely locally
- Framework‑agnostic core with logger integrations
- Defensive defaults with explicit configuration


---

## 📦 Installation

```bash
npm install pii-guard

```

```ts
import { redactValue } from "pii-guard";

const payload = {
  email: "user@example.com",
  ssn: "123-45-6789",
  password: "supersecret"
};

const result = redactValue(payload);
// { email: "[EMAIL]", ssn: "[SSN]", password: "[REDACTED_KEY]" }
```

---

## 🧪 Demo Application

### secure-log-demo

An Express + Pino demo application showing how to safely integrate
`pii-guard` into a real logging pipeline and avoid leaking sensitive data
in request logs.

```bash
npm install
npm run dev
```

The demo demonstrates:

- Structured logging with automatic redaction
- Safe request and response serialization
- Practical log hygiene for production systems

---

## 🛡️ Security Philosophy

PII‑Guard is intentionally defensive by design:

- Pattern‑based detection with explicit trade‑offs
- No assumption that inputs are trusted
- Clear separation between detection, redaction, and reporting
- Designed to reduce blast radius from accidental logging

---

## ⚠️ Important

This library reduces risk but does not guarantee compliance.
Detection is heuristic‑based and may produce false positives or negatives.

---

## 🧰 Development Environment

This project uses a VS Code Dev Container to provide a fully sandboxed,
reproducible TypeScript development environment powered by Docker.

- No host‑level Node.js installation required
- Consistent toolchain across machines
- Safe isolation when working with security‑sensitive code

### Getting Started

1. Open the repository in VS Code
2. Select “Reopen in Container”
3. Start developing immediately

---

📜 License
This application is covered under the MIT License.

© 2026 and beyond by Lora with 💖

