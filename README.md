# PayPilot AI — Your AI Shopping Copilot

> **Discover smarter. Compare better. Pay confidently.**  
> An intelligent shopping copilot and payment assistant combining natural language intent extraction, deterministic spec ranking, side-by-side trade-off matrices, and server-verified PayPal sandbox checkout.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](#)
[![Tests](https://img.shields.io/badge/tests-13%20passed-success)](#)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20v2-0070BA)](#)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash%20%2B%20Heuristic%20Engine-8E75C4)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📌 Executive Summary

Online shopping often forces buyers to navigate dozens of cluttered tabs, decipher obscure technical specifications, and cross-reference prices manually. **PayPilot AI** transforms this fragmented experience into an intuitive, guided conversation.

Users describe what they need in natural language. PayPilot AI:
1. **Extracts Requirements**: Accurately parses category, target budget, must-have hardware features, and trade-off priorities.
2. **Evaluates Grounded Evidence**: Deterministically scores products from an authoritative catalogue against real specifications (no hallucinated features or fabricated prices).
3. **Conducts Side-by-Side Trade-off Analysis**: Compares shortlisted products in a structured matrix highlighting spec winners and honest compromises.
4. **Enforces Strict Payment Integrity**: Re-calculates cart totals on the backend and captures payments through the official **PayPal Sandbox REST API** with explicit user approval.

> **Hackathon Attribution**: PayPilot AI is an independent prototype built for the **PayPal AI Hackathon**. PayPal is a trademark of PayPal, Inc.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| 💬 **Conversational AI Workspace** | Chat with an intelligent copilot that asks clarifying questions, parses budget ceilings, and extracts must-have attributes in real-time. |
| 🎯 **Deterministic Spec Ranking** | Verifiable specs (battery life, dimensions, ANC, connectivity) are scored using transparent mathematical weights rather than opaque LLM guesses. |
| ⚖️ **Side-by-Side Comparison Matrix** | Multi-product cross-analysis (up to 4 items) evaluating price, battery stamina, user ratings, strengths, and AI-synthesized trade-offs. |
| 💳 **PayPal Sandbox Integration** | Server-to-server OAuth2 authentication, v2 orders creation, price verification, and capture with explicit user approval. |
| 💰 **Budget Intelligence** | Dynamic visual progress bar monitoring target budget utilization, remaining savings, or stretch overruns. |
| 🛡️ **Zero Price Hallucination** | Client-submitted prices are untrusted. The backend recalculates order subtotals and shipping fees from authoritative database records. |
| 📊 **Shopping Insights Dashboard** | Real-time analytics computed from verified transactions: total sandbox spend, completed orders, category breakdown, and itemized receipts. |
| 🌐 **Transparent Multi-Currency** | Toggle between USD ($) base checkout and INR (₹) display with explicit, disclosed conversion rates (1 USD = 83.5 INR). |
| 🔄 **Zero-Crash Resilience** | Built-in high-precision deterministic heuristic engine ensures 100% functionality even when an external LLM API key is absent or rate-limited. |

---

## 🏗️ Architecture

```
[ User Natural Language Shopping Request ]
                    │
                    ▼
          [ AI Intent Parser ] ──(Extracts: Category, Budget, Must-haves)
                    │
                    ▼
     [ Deterministic Ranking Engine ] ──(Scores Authoritative Catalogue Specs)
                    │
                    ▼
       [ Grounded Explanations ] ──(Synthesizes Evidence-Backed Pros & Cons)
                    │
                    ▼
     [ Side-by-Side Comparison Matrix ] ──(Evaluates Spec Winners & Trade-offs)
                    │
                    ▼
       [ Explicit User Approval ] ──(User Confirms Order Total & Authorizes)
                    │
                    ▼
     [ Server-Verified PayPal Sandbox ] ──(Strict Server-Side Price Recalculation)
                    │
                    ▼
    [ Order Confirmation & Insights ] ──(Ledger Recording & Spending Analytics)
```

For complete technical specifications, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 💻 Technology Stack

### Frontend (`apps/web`)
- **Framework**: React 19, TypeScript, Vite
- **Sponsor Integration**: **AG Grid Community v36** (Interactive comparison & catalogue matrix)
- **Styling**: Tailwind CSS, Bespoke Fintech & Tactile Brutalist Design Tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data & Routing**: TanStack React Query, React Router v7

### Backend API (`apps/api`)
- **Runtime**: Node.js, Express, TypeScript (Strict Mode)
- **Validation**: Zod runtime schema validation
- **Security**: Helmet HTTP headers, CORS whitelisting, centralized error handling
- **Testing**: Vitest, Supertest (13 integration tests passing)

### AI & Payments
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`) + Intelligent Deterministic Heuristic Fallback
- **Payments**: Official PayPal Developer REST APIs (`/v1/oauth2/token`, `/v2/checkout/orders`, `/v2/checkout/orders/{id}/capture`)

### 🏆 Hackathon Sponsor Integrations
- **PayPal Developer Platform**: Complete sandbox payment lifecycle, price verification & capture.
- **AG Grid**: Integrated in `apps/web` for advanced multi-column spec comparison and catalogue exploration.
- **Postman**: Complete Postman collection included ([paypilot.postman_collection.json](paypilot.postman_collection.json)).
- **Render**: Infrastructure-as-code deployment blueprint ([render.yaml](render.yaml)).
- **APIMatic**: Full OpenAPI 3.0 specification ([docs/openapi.json](docs/openapi.json)).
- **Devpost Submission Guide**: Complete submission text prepared in [SUBMISSION.md](SUBMISSION.md).

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Node.js** >= v20.0.0
- **npm** >= 10.0.0

### 1. Clone & Install
```bash
git clone https://github.com/your-username/paypilot-ai.git
cd paypilot-ai
npm install
```

### 2. Configure Environment
Create `.env` in the root (or copy from `.env.example`):
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Add your Google Gemini API Key from Google AI Studio
# If omitted, PayPilot automatically runs in labeled Deterministic Heuristic Mode!
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional: Add your PayPal Developer Sandbox Credentials
# If omitted, PayPilot runs in a transparent Sandbox Simulation mode!
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret_here
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

### 3. Build & Run
Run both API and Web concurrently:
```bash
# Terminal 1: Backend API (Port 5000)
npm run start --workspace=@paypilot/api

# Terminal 2: Frontend Web App (Port 5173)
npm run dev --workspace=@paypilot/web
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Testing

Run backend integration test suites:
```bash
npm run test --workspace=@paypilot/api
```

**Test Coverage Highlights**:
- ✅ Health endpoint & provider detection
- ✅ Catalogue filtering, category queries, and ID lookup
- ✅ Natural language budget extraction in USD & INR
- ✅ Deterministic ranking engine scoring
- ✅ Strict rejection of client-side price tampering
- ✅ Server-recalculated totals (subtotal, shipping, tax)
- ✅ Order creation and PayPal capture flow
- ✅ Idempotent payment capture on repeated attempts
- ✅ Real-time shopping insights calculation

---

## 🔒 Security & Payment Integrity

1. **No Client Trust for Financial Data**: The client cannot submit prices or modify calculated totals. All line items are matched against backend catalogue records.
2. **Explicit Consent**: PayPilot AI strictly mandates explicit user authorization before launching payment sessions.
3. **Server-Side Credentials**: PayPal client secrets are kept exclusively on the server.
4. **Idempotency**: Orders cannot be double-captured. Replay requests return the existing verified receipt safely.

Detailed security documentation: [docs/SECURITY.md](docs/SECURITY.md).

---

## 📹 Hackathon Demonstration Walkthrough

A concise < 3 minute judge demonstration script is provided in [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md).

1. **Natural Language Query**: Describe requirements (e.g. *"Headphones under $150 with ANC for Zoom"*).
2. **Intent & Evidence**: Observe extracted constraints and grounded spec-based rationale.
3. **Trade-off Matrix**: Compare 3 products side-by-side to understand compromises.
4. **PayPal Sandbox Checkout**: Explicitly approve and authorize the sandbox transaction.
5. **Verified Receipt & Insights**: View the captured PayPal reference and updated analytics dashboard.

---

## 📄 Licence

This project is open-source software licensed under the [MIT License](LICENSE).
