import crypto from 'crypto';
import {
  SpendPolicyConfig,
  GuardrailEvaluation,
  PolicyZone,
  MultiMerchantSKU,
} from '@paypilot/shared';

export const DEFAULT_SPEND_POLICY: SpendPolicyConfig = {
  maxAutoApproveLimit: 250.0,
  hardTransactionCeiling: 300.0,
  dailySpendVelocityCap: 500.0,
  allowedCategories: [
    'microphone',
    'headphones',
    'boom arm',
    'keyboard',
    'mouse',
    'lighting',
    'accessories',
    'espresso maker',
    'grinder',
    'scale',
    'audio',
    'peripherals',
    'workstation',
  ],
  requireVerifiedMerchants: true,
};

export class SpendGuardrailsService {
  private activePolicy: SpendPolicyConfig = { ...DEFAULT_SPEND_POLICY };

  public getPolicy(): SpendPolicyConfig {
    return { ...this.activePolicy };
  }

  public updatePolicy(newPolicy: Partial<SpendPolicyConfig>): SpendPolicyConfig {
    this.activePolicy = {
      ...this.activePolicy,
      ...newPolicy,
    };
    return { ...this.activePolicy };
  }

  public evaluateCart(
    items: MultiMerchantSKU[],
    totalCost: number,
    policyOverride?: Partial<SpendPolicyConfig>
  ): GuardrailEvaluation {
    const policy = { ...this.activePolicy, ...policyOverride };
    const checkedCategories = items.map((i) => i.category);

    // 1. Verify Allowed Categories
    const categoryViolation = items.some(
      (it) => !policy.allowedCategories.map((c) => c.toLowerCase()).includes(it.category.toLowerCase())
    );

    // 2. Compute Policy Passport Cryptographic Hash (SHA-256)
    const hashPayload = JSON.stringify({
      maxAutoApproveLimit: policy.maxAutoApproveLimit,
      hardTransactionCeiling: policy.hardTransactionCeiling,
      totalCost,
      skus: items.map((i) => ({ sku: i.skuId, price: i.price, merchant: i.merchantDomain })),
      nonce: 'passport_v2_paypal_sandbox',
    });
    const policyPassportHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    // 3. Three-Zone Evaluation Logic
    let zone: PolicyZone = 'GREEN';
    let zoneReason = 'Cart total is within autonomous limit. Full Green-Zone auto-dispatch permitted.';

    if (categoryViolation) {
      zone = 'RED';
      zoneReason = 'Policy violation: Contains categories outside pre-authorized procurement whitelist.';
    } else if (totalCost > policy.hardTransactionCeiling) {
      zone = 'RED';
      zoneReason = `Hard policy block: Cart total ($${totalCost.toFixed(2)}) exceeds absolute transaction ceiling of $${policy.hardTransactionCeiling.toFixed(2)}.`;
    } else if (totalCost > policy.maxAutoApproveLimit) {
      zone = 'YELLOW';
      const overage = (totalCost - policy.maxAutoApproveLimit).toFixed(2);
      zoneReason = `Human-in-the-loop escalation required: Cart total exceeds auto-approve threshold ($${policy.maxAutoApproveLimit.toFixed(2)}) by $${overage}.`;
    }

    return {
      zone,
      cartTotal: totalCost,
      maxAutoApproveLimit: policy.maxAutoApproveLimit,
      hardTransactionCeiling: policy.hardTransactionCeiling,
      policyPassportHash,
      isAutonomousApproved: zone === 'GREEN',
      requiresHumanApproval: zone === 'YELLOW',
      isBlocked: zone === 'RED',
      zoneReason,
      checkedCategories,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const spendGuardrailsService = new SpendGuardrailsService();

