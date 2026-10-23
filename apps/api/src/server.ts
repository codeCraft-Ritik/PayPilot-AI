import { app } from './app.js';
import { env, isGeminiConfigured, isPayPalConfigured } from './config/env.js';
import { aiService } from './modules/ai/ai.service.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
================================================================
🚀 PayPilot AI Backend API Server Started
================================================================
• URL:             http://localhost:${PORT}
• Health Check:    http://localhost:${PORT}/api/health
• Client URL:      ${env.CLIENT_URL}
• Environment:     ${env.NODE_ENV}
• AI Provider:     ${aiService.getActiveProvider().getProviderName()} ${
    isGeminiConfigured ? '🟢 [Gemini Live]' : '🟡 [Demo Heuristic Engine Active]'
  }
• PayPal Sandbox:  ${
    isPayPalConfigured ? '🟢 [PayPal Live Sandbox Credentials Detected]' : '🟡 [Demo Sandbox Simulation Active]'
  }
================================================================
`);
});
