# PayPilot AI — Hackathon 3-Minute Demo Walkthrough

**Target Duration**: 2 minutes 45 seconds  
**Objective**: Demonstrate conversational discovery, grounded evidence, budget intelligence, side-by-side trade-off matrix, and verified PayPal Sandbox checkout.

---

### Step 1: Hook & Core Problem (0:00 - 0:25)
- Open `http://localhost:5173/`.
- *"Online shopping forces users to juggle 10 open browser tabs, decipher confusing technical specifications, and cross-check prices manually. PayPilot AI solves this by bringing AI intelligence, deterministic spec comparison, and verified PayPal checkout into one unified copilot."*

### Step 2: Natural Language Shopping Query (0:25 - 1:00)
- In the hero search box (or clicking the sample prompt):
  - Enter: `"Find wireless headphones under $150 with good battery life, comfortable fit, and a microphone suitable for online meetings."`
  - Click **Ask Pilot**.
- The page transitions to the **AI Shopping Workspace** (`/workspace`):
  - Point out the **Extracted Intent** panel: Category identified as `audio`, Target Budget extracted as `$150.00`, and Must-Have Features identified as `battery`, `microphone`, `wireless`.
  - Point out the **Budget Utilization Bar**: Shows real-time budget comparison.
  - Show the top recommended product: **Anker Soundcore Space Q45** (95% Match Score) with grounded reasoning: citing its 50-hour battery life and honest trade-offs.

### Step 3: Side-by-Side Trade-off Comparison (1:00 - 1:40)
- On the product cards, click the **Compare** scale button on:
  1. `Anker Soundcore Space Q45` ($129.99)
  2. `Sony WH-1000XM5` ($398.00)
  3. `Bose QuietComfort 45` ($279.00)
- Click **Compare 3 Products** in the header to open `/compare`:
  - Show the **AI Executive Verdict**: Explains why Anker is best value, while Sony leads in absolute noise cancellation.
  - Review the **Attribute Specification Matrix**: Highlighting battery hours winner (Anker: 50h) vs ANC winner (Sony).

### Step 4: Cart & Explicit Approval (1:40 - 2:15)
- On the comparison table, click **Add to Cart** on the Anker Space Q45.
- The **Shopping Cart Drawer** opens:
  - Show authoritative subtotal ($129.99) and free shipping calculation.
  - Click **Proceed to PayPal Sandbox**.
- The **Checkout Modal** appears:
  - Emphasize the **Explicit User Approval requirement**: The user remains in full control of their purchase.
  - Check the confirmation box: *"I approve submitting this order of $129.99 USD to PayPal Sandbox"*.
  - Click **Initialize PayPal Sandbox Session**.

### Step 5: Verified Payment & Order Confirmation (2:15 - 2:35)
- Click **Authorize & Complete Sandbox Payment**.
- Show the server-side verification animation.
- The **Order Confirmation Screen** (`/order/ord_...`) loads:
  - Show the verified **PayPal Capture ID**, timestamp, itemized breakdown, and status: `COMPLETED (CAPTURED)`.
  - Highlight that server-side recalculation prevented any client price tampering.

### Step 6: Shopping Insights & Closing (2:35 - 2:50)
- Click **View Spending Dashboard** (`/insights`):
  - Show real-time verified stats: Total purchases, verified sandbox spend in USD, and category breakdown.
- *"PayPilot AI: Discover smarter, compare better, pay confidently."*
