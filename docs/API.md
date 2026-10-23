# PayPilot AI — REST API Reference

Base URL: `http://localhost:5000/api`

---

## 1. System Health

### `GET /health`
Returns the status of the backend API, active AI provider, and PayPal Sandbox configuration.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-23T15:00:00.000Z",
  "aiProvider": "Google Gemini (gemini-2.5-flash)",
  "isUsingAiFallback": false,
  "paypalConfigured": true,
  "paypalEnvironment": "sandbox"
}
```

---

## 2. Product Catalogue

### `GET /products`
Retrieve products from the curated catalogue with optional query filters.

**Query Parameters**:
- `category` (optional): `audio`, `peripherals`, `workstation`, `smart-home`, `wearables`, `coffee-living`, `cameras`
- `minPrice` (optional): number
- `maxPrice` (optional): number
- `search` (optional): string keyword search

### `GET /products/:id`
Retrieve detailed product specifications, pros, cons, and stock availability.

### `GET /products/categories`
Retrieve all supported product categories with metadata and icons.

---

## 3. AI Shopping Copilot & Recommendations

### `POST /recommendations/assistant`
Analyze a natural-language shopping query and return structured intent, ranked products, and grounded evidence.

**Request Body**:
```json
{
  "query": "Find wireless headphones under $150 with ANC for Zoom calls",
  "userBudget": 150,
  "budgetCurrency": "USD",
  "preferredCategory": "audio"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "query": "Find wireless headphones under $150 with ANC for Zoom calls",
    "intent": {
      "category": "audio",
      "targetBudget": {
        "amount": 150,
        "currency": "USD",
        "normalizedAmountUsd": 150,
        "isStrict": true
      },
      "mustHaveFeatures": ["anc", "wireless", "microphone"],
      "priorities": ["price", "performance"]
    },
    "recommendations": [
      {
        "product": { "id": "prod-aud-02", "name": "Anker Soundcore Space Q45", "price": 129.99 },
        "matchScore": 95,
        "breakdown": { "overallScore": 95, "budgetScore": 98, "featureScore": 95, "ratingScore": 92 },
        "budgetStatus": "under-budget",
        "budgetDifferenceUsd": 20.01,
        "whyItFits": "Fits budget with $20.01 in savings. Delivers 50-hour battery and adaptive ANC.",
        "tradeOffs": "Microphone is adequate in quiet rooms but picks up background chatter."
      }
    ],
    "alternatives": [],
    "assistantMessage": "Based on your request, I identified 3 standout options in audio within your $150 budget...",
    "isFallbackEngine": false,
    "modelIdentifier": "Google Gemini (gemini-2.5-flash)",
    "processingTimeMs": 284
  }
}
```

### `POST /recommendations/compare`
Generate a side-by-side specification comparison matrix and trade-off synthesis for 2 to 4 products.

---

## 4. Payments (PayPal Sandbox)

### `GET /payments/config`
Retrieve the public PayPal Client ID and active sandbox environment mode.

### `POST /payments/create-order`
Initialize a checkout order. **The backend recalculates all prices authoritatively.**

**Request Body**:
```json
{
  "items": [
    { "productId": "prod-aud-02", "quantity": 1 }
  ],
  "currency": "USD"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_1729699200000_abcde",
      "orderNumber": "PP-2026-834921",
      "subtotal": 129.99,
      "shippingFee": 0,
      "totalAmount": 129.99,
      "currency": "USD",
      "status": "PENDING_APPROVAL"
    },
    "paypalOrderId": "SANDBOX-SIM-XXXXXX",
    "isSimulated": false
  }
}
```

### `POST /payments/capture-order`
Verify and capture the authorized PayPal payment on the server.

**Request Body**:
```json
{
  "orderId": "ord_1729699200000_abcde",
  "paypalOrderId": "SANDBOX-SIM-XXXXXX"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "ord_1729699200000_abcde",
    "orderNumber": "PP-2026-834921",
    "status": "COMPLETED",
    "paypalCaptureId": "CAP-XXXXXX",
    "verifiedAt": "2026-10-23T15:05:00.000Z"
  }
}
```

---

## 5. Orders & Insights

### `GET /orders/:id`: Retrieve verified order record by ID
### `GET /orders`: List all stored orders
### `GET /insights`: Retrieve aggregated spending metrics, category breakdown, and completed order counts
