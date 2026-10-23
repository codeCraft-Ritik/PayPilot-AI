# Contributing to PayPilot AI

Thank you for your interest in contributing to **PayPilot AI: Your AI Shopping Copilot**!

## Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/paypilot-ai.git
   cd paypilot-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY and PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET
   ```

4. **Run in development mode**:
   ```bash
   npm run dev:api  # Starts Express server on port 5000
   npm run dev:web  # Starts Vite frontend on port 5173
   ```

5. **Run test suites**:
   ```bash
   npm run test --workspace=@paypilot/api
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

## Architectural Guidelines
- **Zero-hallucination prices**: Never allow client or LLM to dictate authoritative product prices.
- **Explicit user consent**: Never initiate PayPal transactions without user confirmation.
- **Graceful degradation**: Ensure fallback heuristic engine is maintained whenever adding new intent capabilities.
