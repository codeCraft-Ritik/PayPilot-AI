# Devpost Hackathon Submission: PayPilot AI

**Product Name**: PayPilot AI  
**Tagline**: Your AI Shopping Copilot — Discover smarter. Compare better. Pay confidently.  
**Category**: AI Shopping Intelligence & Fintech Assistant  
**Event**: PayPal AI Hackathon  

---

## 💡 Elevator Pitch
PayPilot AI transforms online shopping from manual spec hunting and endless browser tabs into an intelligent, conversational purchasing journey. Powered by Google Gemini and deterministic ranking algorithms, PayPilot AI extracts user constraints, evaluates budget suitability, explains product trade-offs with grounded evidence, and executes server-verified purchases through the **PayPal Sandbox REST API**.

---

## 🔍 Inspiration
Modern e-commerce search is broken. Users describe what they want using natural language (e.g. *"Find wireless headphones under $150 with ANC for Zoom meetings"*), but retail search engines force them through clunky checkbox filters, show sponsored irrelevant results, and leave them to compare specs across 10 tabs manually.

We asked: *What if an AI shopping copilot could understand your exact requirements, rank verifiable catalogue specifications with mathematical transparency, guide you through honest trade-offs, and safely complete checkout via PayPal without ever hallucinating prices or making unauthorized purchases?*

That was the spark for **PayPilot AI**.

---

## ⚡ What It Does

1. **Conversational AI Shopping Workspace**: Users describe their goals, desired features (e.g., battery life, weight, connectivity), and budget. The AI parses the request into a structured intent schema.
2. **Deterministic Spec Ranking & Grounded Evidence**: The AI never hallucinates product specs or prices. A mathematical scoring engine weights budget fit (40%), feature matching (40%), and review ratings (20%) from authoritative catalogue records.
3. **Side-by-Side Trade-off Matrix**: Shortlist up to 4 products to compare specifications side-by-side with automatic spec-winner highlights and an AI Executive Verdict summarizing who each product is best for.
4. **Interactive AG Grid Sponsor Explorer**: Toggle into the AG Grid interactive table to perform client-side multi-column sorting, floating text filtering, and direct cart additions powered by AG Grid Community.
5. **Budget Intelligence**: A real-time visual progress bar monitors budget utilization, celebrates savings, and alerts the user of stretch overruns.
6. **Transparent Multi-Currency**: Seamlessly switch between USD ($) and INR (₹) with disclosed, explicit conversion rates (1 USD = 83.5 INR).
7. **Strict Server-Side Payment Integrity**:
   - Client prices are untrusted.
   - The backend recalculates order subtotals and shipping rules from trusted database records.
   - Explicit user approval checkbox is required before initializing payment sessions.
   - Order creation and capture occur server-to-server via the official PayPal Sandbox REST API (`/v2/checkout/orders`).
8. **Shopping Insights Dashboard**: Real-time spending analytics computed directly from the verified PayPal sandbox transaction ledger.

---

## 🛠️ How We Built It

We built PayPilot AI as a modular TypeScript monorepo designed with tactile brutalism and clean fintech aesthetics:

- **Frontend (`apps/web`)**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query, Lucide icons, and **AG Grid** Community.
- **Backend API (`apps/api`)**: Node.js, Express, TypeScript, Zod schema validation, Helmet security headers, CORS whitelisting.
- **Shared Layer (`packages/shared`)**: Shared TypeScript types, Zod contracts, and currency conversion standards.
- **AI Service Abstraction**:
  - Primary: Google Gemini (`gemini-2.5-flash`) with structured JSON schema outputs.
  - Fallback: Deterministic Heuristic NLP Engine ensuring zero-crash resilience even if API keys are absent or rate-limited.
- **PayPal Integration**: Official PayPal Developer REST APIs for OAuth2 token generation, order creation, and server-side payment capture.

---

## 🏆 Hackathon Sponsor Integrations

We specifically incorporated and documented key hackathon sponsor tools:

1. **PayPal Developer Platform (Primary)**:
   - Server-to-server OAuth2 client-credentials authentication.
   - Server-side `v2/checkout/orders` order creation and capture.
   - Strict price recalculation and idempotency defense against duplicate payments.
2. **AG Grid (Sponsor Track)**:
   - Integrated `ag-grid-react` and `ag-grid-community` (v36) with `themeQuartz`.
   - Powers the interactive multi-column sorting, text filtering, and pagination in the Comparison and Catalogue views.
3. **Postman (Sponsor Track)**:
   - Comprehensive, exportable Postman collection (`paypilot.postman_collection.json`) with pre-configured requests, environment variables, and health checks for all endpoints.
4. **Render (Sponsor Track)**:
   - Infrastructure-as-code `render.yaml` blueprint enabling 1-click cloud deployment of both the API service and frontend static site.
5. **APIMatic (Sponsor Track)**:
   - Full OpenAPI 3.0 specification (`docs/openapi.json`) ready for APIMatic SDK generation and interactive documentation.

---

## 🚧 Challenges We Ran Into

- **Preventing Client Price Manipulation**: E-commerce apps often fall into the trap of accepting cart totals submitted by the browser. We solved this with a strict boundary: the client only submits product IDs and quantities; the server authoritatively recalculates totals against database records.
- **AI Hallucination vs. Fact Grounding**: LLMs can hallucinate specs or make unrealistic claims. We decoupled intent extraction from catalogue querying: the LLM extracts requirements, deterministic algorithms score products against real records, and the LLM synthesizes explanations citing only verifiable fields.
- **Currency Transparency**: PayPal Sandbox operates primarily in USD, while international shoppers frequently evaluate products in INR. We built an explicit conversion utility that discloses the exact exchange rate rather than converting secretly.

---

## 🎉 Accomplishments We're Proud Of

- **13/13 Automated Integration Tests Passing**: Testing health, AI extraction, deterministic ranking, price tampering rejection, and idempotent PayPal capture.
- **Tactile Brutalist Visual System**: Moving away from generic SaaS templates to create a distinctive, confident fintech identity with Inter typography, monospace accents, and responsive layout.
- **True Dual-Engine AI Architecture**: The application never crashes—running seamlessly with live Gemini 2.5 Flash or its built-in deterministic heuristic fallback.
- **End-to-End Working Flow**: From natural language prompt to side-by-side comparison, cart review, explicit approval, PayPal capture, and verified receipt.

---

## 📚 What We Learned

- How to architect robust server-side payment flows with PayPal's REST APIs while ensuring idempotency and data isolation.
- The power of combining deterministic ranking algorithms with generative AI explanations for high-conviction e-commerce decisions.
- Leveraging AG Grid for high-density technical specification comparisons.

---

## 🔮 What's Next for PayPilot AI

- **Multi-Merchant Catalog Crawling**: Real-time integration with live inventory feeds.
- **PayPal Vaulting & Subscriptions**: Support for recurring replenishment (e.g. coffee beans, printer ink).
- **Voice Commerce**: Direct voice shopping interface using browser speech recognition.

---

## 🏷️ Built With
- `paypal-api`
- `gemini-api`
- `react`
- `typescript`
- `ag-grid`
- `postman`
- `render`
- `express`
- `zod`
- `tailwind-css`
- `framer-motion`
- `vite`

---

## 🏁 Try It Out (Run Locally in 2 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/your-username/paypilot-ai.git
cd paypilot-ai

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev:api  # Backend API on port 5000
npm run dev:web  # Frontend Web on port 5173
```
Open **`http://localhost:5173`** in your browser.
