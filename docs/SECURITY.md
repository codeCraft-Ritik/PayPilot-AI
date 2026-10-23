# PayPilot AI — Security & Payment Integrity Policy

## 1. Non-Negotiable Payment Principles

### Authoritative Server-Side Calculation
- Client-submitted prices are completely untrusted. The API accepts only `productId` and `quantity`.
- Every price is fetched directly from the server's authoritative catalogue repository.
- Shipping fees and tax exemptions are strictly calculated on the backend.

### Server-to-Server PayPal Order Creation & Capture
- Sensitive credentials (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`) are never bundled into frontend assets.
- Orders are created via `POST /v2/checkout/orders` directly from Node.js using OAuth2 client-credentials flow.
- Captures are executed via `POST /v2/checkout/orders/{id}/capture` on the backend. An order is marked `COMPLETED` **only after the PayPal API returns an affirmative `COMPLETED` status**.

### Explicit User Consent
- Autopilot or silent purchases are strictly disallowed.
- The user must explicitly inspect order totals and confirm payment authorization before any payment gateway session is initialized.

### Idempotent Capture Processing
- Replay attacks and duplicate payment captures are prevented by verifying order status before executing capture calls.
- Subsequent calls for an already completed order return the existing verified receipt without double-charging.

---

## 2. AI Security & Prompt Injection Mitigation

- **Structured Output Constraints**: The AI service utilizes strict JSON schema enforcement (`responseMimeType: "application/json"`). Arbitrary markdown or code injection is parsed and validated through Zod runtime schemas.
- **Separation of Concerns**: The AI is tasked solely with interpreting user intent, extracting requirements, and articulating grounded explanations. The AI has **zero authority** over database prices, payment capture, order records, or user balances.
- **Catalogue Grounding**: Explanations cite only explicit fields (`specs`, `pros`, `cons`) present in verified catalogue records.

---

## 3. Network and API Hardening

- **Helmet**: Secures HTTP response headers.
- **CORS Configuration**: Restricts API access to verified client origins.
- **Input Validation**: All query parameters and POST bodies are strictly validated with Zod before processing.
