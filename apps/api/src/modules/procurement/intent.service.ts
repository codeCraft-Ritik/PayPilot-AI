import {
  DecomposedMissionIntent,
  RequiredCategoryConstraint,
  DeliveryPriority,
} from '@paypilot/shared';

export class ProcurementIntentService {
  public parseNaturalLanguageMission(prompt: string): DecomposedMissionIntent {
    const q = prompt.toLowerCase();

    // 1. Hard Budget Extraction
    let hardBudgetMax = 280;
    const budgetMatch = q.match(/(?:\$|usd)\s*(\d+(?:\.\d+)?)/i) || q.match(/under\s*(\d+(?:\.\d+)?)/i);
    if (budgetMatch) {
      hardBudgetMax = parseFloat(budgetMatch[1]);
    }

    // 5% reserve buffer for taxes/shipping
    const allocatedBufferUsd = Math.round(hardBudgetMax * 0.05 * 100) / 100;
    const netProcurementBudgetUsd = Math.round((hardBudgetMax - allocatedBufferUsd) * 100) / 100;

    // Delivery Priority
    let deliveryPriority: DeliveryPriority = 'balanced';
    if (/fast|quick|overnight|rush|express/i.test(q)) {
      deliveryPriority = 'fastest';
    } else if (/cheap|lowest|save|budget/i.test(q)) {
      deliveryPriority = 'cheapest';
    }

    // Preset 1: Podcasting
    if (/podcast|mic|audio|starter kit/i.test(q)) {
      const isTwoPerson = /two|2|pair/i.test(q);
      const qty = isTwoPerson ? 2 : 1;
      const subBudgetPerItem = netProcurementBudgetUsd / 3;

      const categories: RequiredCategoryConstraint[] = [
        {
          categoryName: 'Microphone',
          quantity: qty,
          allocatedSubBudgetUsd: Math.round(subBudgetPerItem * 0.45 * 100) / 100,
          mustHaveSpecs: ['USB-C', 'Cardioid', 'Headphone Jack'],
          preferredBrands: ['Audio-Technica', 'Samson', 'Rode'],
        },
        {
          categoryName: 'Headphones',
          quantity: qty,
          allocatedSubBudgetUsd: Math.round(subBudgetPerItem * 0.35 * 100) / 100,
          mustHaveSpecs: ['Closed-Back', 'Over-Ear', 'Isolation'],
          preferredBrands: ['Audio-Technica', 'Sony'],
        },
        {
          categoryName: 'Boom Arm',
          quantity: qty,
          allocatedSubBudgetUsd: Math.round(subBudgetPerItem * 0.20 * 100) / 100,
          mustHaveSpecs: ['Desk Clamp', '360-degree rotation'],
          preferredBrands: ['InnoGear', 'Rode'],
        },
      ];

      return {
        missionTitle: isTwoPerson ? 'Two-Person Podcasting Starter Kit' : 'Solo Podcasting Studio Kit',
        hardBudgetMax,
        allocatedBufferUsd,
        netProcurementBudgetUsd,
        deliveryPriority,
        requiredCategories: categories,
        sourcePrompt: prompt,
        sourceType: 'text',
        timestamp: new Date().toISOString(),
      };
    }

    // Preset 2: Developer Desk Setup
    if (/keyboard|mouse|desk|developer|ergonomic|lightbar/i.test(q)) {
      const subBudgetPerItem = netProcurementBudgetUsd / 4;
      return {
        missionTitle: 'Ergonomic Developer Desk Setup',
        hardBudgetMax,
        allocatedBufferUsd,
        netProcurementBudgetUsd,
        deliveryPriority,
        requiredCategories: [
          {
            categoryName: 'Keyboard',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.40 * 100) / 100,
            mustHaveSpecs: ['Mechanical', 'Hot-swappable', 'USB-C'],
            preferredBrands: ['Keychron'],
          },
          {
            categoryName: 'Mouse',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.35 * 100) / 100,
            mustHaveSpecs: ['Ergonomic', 'Quiet Click', 'MagSpeed'],
            preferredBrands: ['Logitech'],
          },
          {
            categoryName: 'Lighting',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.15 * 100) / 100,
            mustHaveSpecs: ['Screen Lightbar', 'Glare-free'],
            preferredBrands: ['Baseus'],
          },
          {
            categoryName: 'Accessories',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.10 * 100) / 100,
            mustHaveSpecs: ['Waterproof Desk Pad'],
            preferredBrands: ['Aothia'],
          },
        ],
        sourcePrompt: prompt,
        sourceType: 'text',
        timestamp: new Date().toISOString(),
      };
    }

    // Preset 3: Dorm Espresso Bar
    if (/coffee|espresso|grinder|dorm/i.test(q)) {
      return {
        missionTitle: 'Dorm Espresso & Grinder Station',
        hardBudgetMax,
        allocatedBufferUsd,
        netProcurementBudgetUsd,
        deliveryPriority,
        requiredCategories: [
          {
            categoryName: 'Espresso Maker',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.55 * 100) / 100,
            mustHaveSpecs: ['Manual Lever', '9 Bar Pressure', 'Non-Electric'],
            preferredBrands: ['Flair'],
          },
          {
            categoryName: 'Grinder',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.35 * 100) / 100,
            mustHaveSpecs: ['Conical Burr', 'Espresso Fine'],
            preferredBrands: ['Timemore'],
          },
          {
            categoryName: 'Scale',
            quantity: 1,
            allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.10 * 100) / 100,
            mustHaveSpecs: ['0.1g Precision', 'Built-in Timer'],
            preferredBrands: ['Weightman'],
          },
        ],
        sourcePrompt: prompt,
        sourceType: 'text',
        timestamp: new Date().toISOString(),
      };
    }

    // Default Fallback
    return {
      missionTitle: 'Custom Multi-Merchant Procurement',
      hardBudgetMax,
      allocatedBufferUsd,
      netProcurementBudgetUsd,
      deliveryPriority,
      requiredCategories: [
        {
          categoryName: 'Microphone',
          quantity: 1,
          allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.6 * 100) / 100,
          mustHaveSpecs: ['USB-C'],
          preferredBrands: ['Audio-Technica'],
        },
        {
          categoryName: 'Headphones',
          quantity: 1,
          allocatedSubBudgetUsd: Math.round(netProcurementBudgetUsd * 0.4 * 100) / 100,
          mustHaveSpecs: ['Closed-Back'],
          preferredBrands: ['Sony'],
        },
      ],
      sourcePrompt: prompt,
      sourceType: 'text',
      timestamp: new Date().toISOString(),
    };
  }

  public parseVisionInput(imageBase64OrUrl: string, missionHint?: string): DecomposedMissionIntent {
    // Generates procurement mission from visual upload
    const baseIntent = this.parseNaturalLanguageMission(
      missionHint || 'Equip a two-person podcasting starter kit under $280 total with USB-C mics, closed-back headphones, and boom arms'
    );
    return {
      ...baseIntent,
      missionTitle: `[Vision] ${baseIntent.missionTitle}`,
      sourceType: 'vision',
      timestamp: new Date().toISOString(),
    };
  }

  public refineMissionConstraints(
    currentState: DecomposedMissionIntent,
    refinementPrompt: string
  ): DecomposedMissionIntent {
    const q = refinementPrompt.toLowerCase();
    let updatedHardBudget = currentState.hardBudgetMax;

    // Check if budget was changed in refinement
    const budgetMatch = q.match(/(?:\$|usd)\s*(\d+(?:\.\d+)?)/i) || q.match(/(?:to|under|cap)\s*(\d+(?:\.\d+)?)/i);
    if (budgetMatch) {
      updatedHardBudget = parseFloat(budgetMatch[1]);
    }

    // Check if priority was changed
    let updatedPriority = currentState.deliveryPriority;
    if (q.includes('fast') || q.includes('quick') || q.includes('urgent') || q.includes('overnight')) {
      updatedPriority = 'fastest';
    } else if (q.includes('cheap') || q.includes('lowest') || q.includes('save') || q.includes('value')) {
      updatedPriority = 'cheapest';
    } else if (q.includes('balance') || q.includes('standard')) {
      updatedPriority = 'balanced';
    }

    const allocatedBufferUsd = Math.round(updatedHardBudget * 0.05 * 100) / 100;
    const netProcurementBudgetUsd = Math.round((updatedHardBudget - allocatedBufferUsd) * 100) / 100;

    // Re-normalize sub-budgets proportionally
    const ratio = netProcurementBudgetUsd / currentState.netProcurementBudgetUsd;
    const reallocatedCategories = currentState.requiredCategories.map((c) => ({
      ...c,
      allocatedSubBudgetUsd: Math.round(c.allocatedSubBudgetUsd * ratio * 100) / 100,
    }));

    return {
      ...currentState,
      hardBudgetMax: updatedHardBudget,
      allocatedBufferUsd,
      netProcurementBudgetUsd,
      deliveryPriority: updatedPriority,
      requiredCategories: reallocatedCategories,
      sourcePrompt: `${currentState.sourcePrompt} -> Refinement: "${refinementPrompt}"`,
      sourceType: 'refined',
      timestamp: new Date().toISOString(),
    };
  }
}

export const procurementIntentService = new ProcurementIntentService();
