# PayPilot AI — System Architecture Specification

## 1. High-Level Overview

PayPilot AI is an intelligent shopping intelligence copilot and payment assistant designed for the **PayPal AI Hackathon**. It transforms e-commerce from manual keyword searching and multi-tab comparison into a guided conversational workflow:

```
[ User Natural Language Query ]
               │
               ▼
   [ AI Intent Parser ] ──(Extracts: Category, Budget, Must-haves, Priorities)
               │
               ▼
[ Deterministic Ranking Engine ] ──(Queries Authoritative Catalogue & Computes Match Scores)
               │
               ▼
  [ Grounded Explanations ] ──(Generates Evidence-backed Pros, Cons & Trade-offs)
               │
               ▼
 [ Interactive Comparison Matrix ] ──(Side-by-Side Spec Winner Evaluation)
               │
               ▼
  [ Explicit User Approval ] ──(User Reviews Order & Authorizes Checkout)
               │
               ▼
 [ Server-Verified PayPal Sandbox ] ──(Server Creates & Captures Order; Strictly Recalculates Prices)
               │
               ▼
[ Verified Order Confirmation & Insights ] ──(Ledger Storage & Real-time Spending Analytics)
```

---

## 2. Monorepo Structure

```
paypilot-ai/
├── apps/
│   ├── web/                     # React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion
│   │   ├── src/
│   │   │   ├── components/      # Reusable tactile brutalist UI & layout components
│   │   │   ├── context/         # Currency, Cart, Budget & Compare state management
│   │   │   ├── features/        # Feature slices (Landing, Workspace, Compare, Checkout, Orders, Insights)
│   │   │   └── services/        # Typed API client
│   └── api/                     # Node.js + Express + TypeScript + Zod
│       ├── src/
│       │   ├── config/          # Zod environment variable parsing
│       │   ├── middleware/      # Helmet, CORS, Error handler
│       │   ├── modules/
│       │   │   ├── ai/          # AI Service abstraction (Gemini 2.5 Flash + Deterministic Heuristics)
│       │   │   ├── products/    # Product repository, curated 20+ item sample catalogue
│       │   │   ├── recommendations/ # Deterministic ranking engine & comparison generator
│       │   │   ├── payments/    # PayPal REST API Client (OAuth2, v2 Orders Create & Capture)
│       │   │   ├── orders/      # File-backed JSON & in-memory order repository
│       │   │   └── insights/    # Stored ledger analytics & category spend aggregation
│       └── tests/               # 13 Vitest integration test suites
├── packages/
│   └── shared/                  # Monorepo shared package
│       ├── src/
│       │   ├── types/           # Domain interfaces (Product, Intent, Recommendation, Order, Currency)
│       │   ├── schemas/         # Zod runtime validation schemas
│       │   └── constants/       # Categories, sample queries, exchange rates
└── docs/                        # Architecture, API, Security & Demo specifications
```

---

## 3. Core Architectural Subsystems

### A. AI Engineering Layer (`apps/api/src/modules/ai/`)
- **Provider Abstraction (`IAIProvider`)**: Decouples the application from any single model vendor.
- **Google Gemini Provider (`gemini.provider.ts`)**: Connects to `gemini-2.5-flash` using `@google/generative-ai` with structured JSON output schema.
- **Deterministic Heuristic Fallback Provider (`fallback.provider.ts`)**: An intelligent zero-dependency NLP parser that extracts currencies (USD/INR), budget ceilings, must-have features, and generates spec-grounded rationales.
- **Zero-Crash Resilience**: If `GEMINI_API_KEY` is not supplied or if rate limits occur, the system automatically falls back to the deterministic engine and transparently labels responses (`isFallbackEngine: true`).

### B. Deterministic Ranking Engine (`apps/api/src/modules/recommendations/ranking.engine.ts`)
- **Principle**: The AI model is strictly prohibited from inventing product facts, fabricating specs, or setting authoritative prices.
- **Scoring Breakdown**:
  - `budgetScore` (40%): Evaluates fit against the target budget. Exact/under-budget options receive top scores, with gradual penalty for stretch options (+15%) and steep penalty for excessive over-budget items.
  - `featureScore` (40%): Verifiable matching of extracted requirements against authoritative product specifications and tags.
  - `ratingScore` (20%): Normalized customer feedback rating from catalogue records.
  - `overallScore`: Weighted aggregate score (0-99%) presented with full transparent breakdown.

### C. Payment Integrity & Security Model (`apps/api/src/modules/payments/`)
- **Authoritative Price Recalculation**: The frontend submits only product IDs and requested quantities. The server retrieves trusted price records from the database and recalculates subtotal, shipping fees, and order totals.
- **Client Price Rejection**: Any attempt to tamper with prices on the client is completely ignored.
- **Explicit User Consent**: Orders are never submitted to PayPal without an explicit checkbox authorization step by the user.
- **Server-to-Server Capture**: Captures occur server-side via the PayPal REST API (`/v2/checkout/orders/{id}/capture`), verifying order completion before persisting the order as paid.
- **Idempotency**: Repeated capture attempts return the existing verified order record without duplicate processing.

### D. Currency Handling
- **Base Currency**: PayPal sandbox payments are executed in **USD**.
- **Transparent Multi-Currency**: Users can toggle between **USD ($)** and **INR (₹)**. When INR is selected, an explicit transparent exchange rate (1 USD = 83.5 INR) is applied and clearly stated to the user prior to checkout.
