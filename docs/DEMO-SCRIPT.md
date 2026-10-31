# PayPilot AI — Hackathon Video Demo Walkthrough (< 2 Minutes)

**Target Duration**: 1 minute 50 seconds (Under 2-minute judge requirement)  
**Target Tracks**: **Agentic Commerce Track ($5,000)**, **Channel3 Sponsor Prize ($1,500)**, **Render Cloud Sponsor**, **AG Grid Sponsor**

---

### Step 1: Hook & Core Problem (0:00 - 0:25)
- Open `http://localhost:5173/`.
- *"Online shopping forces users to juggle 10 browser tabs and decipher specs manually, while generic chatbots hallucinate prices. PayPilot AI solves this by introducing an autonomous shopping agent that browses real-time product graphs, knapsack optimizes your budget, and stages verified PayPal checkout."*

### Step 2: Autonomous Agentic Commerce & Channel3 (0:25 - 1:05)
- From the floating navbar, click **Agent Pilot ($5k Track)** or in `/workspace?mode=agent`:
- Click the demonstration mission:  
  **"Equip my desk with wireless ANC headphones and an ergonomic mouse under $300"**
- Click **Dispatch Agent**.
- Watch the live **Agent Reasoning Trace (6 Phases)** execute in seconds:
  1. 🧠 **Goal Decomposition**: Parses category requirements (`audio` + `peripherals`) and strict ceiling (`$300.00`).
  2. 🔍 **Channel3 Query**: Searches **Channel3's 100M+ real product graph** for wireless ANC headphones and ergonomic mice.
  3. ⚖️ **Deterministic Spec Scoring**: Evaluates real battery life, noise cancellation, and user ratings without hallucination.
  4. 💰 **Combinatorial Budget Knapsack Optimization**: Pairs the Sony WH-1000XM4/Anker Space Q45 and Logitech Mouse into an optimal bundle under $300.
  5. 🛒 **Server-Side Cart Assembly**: Enforces zero price tampering with authoritative server recalculation.
  6. 💳 **PayPal Sandbox v2 Staging**: Generates official PayPal Sandbox Order ID automatically.

### Step 3: Human-in-the-Loop Safe Approval (1:05 - 1:30)
- Point to the **Budget Utilization Gauge**: 
  - Subtotal: $229.98 / $300.00 USD (+$70.02 saved capital!).
- Click **"Approve Agent's Choice & Pay with PayPal ($229.98)"**.
- The **Checkout Modal** appears with pre-populated, verified line items.
- Point out the security safeguard: The autonomous agent prepares the transaction, but **explicit user authorization** is required before capturing funds.
- Check the approval box and click **Authorize & Complete Sandbox Payment**.

### Step 4: Verified Receipt, Sponsor Stack & Closing (1:30 - 1:50)
- The **Order Confirmation Screen** immediately loads:
  - Highlights verified **PayPal Capture ID**, timestamp, and status: `COMPLETED`.
- Open **Insights Dashboard** (`/insights`):
  - Shows real-time spend analytics computed directly from the completed PayPal transaction ledger.
- Conclude:
  - *"In under two minutes, PayPilot AI autonomously found, optimized, and captured a real multi-item purchase using Channel3 and PayPal Sandbox. Thank you!"*
