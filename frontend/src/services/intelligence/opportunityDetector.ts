import { BusinessProfile } from '../../types/businessProfile';
import { GrowthScoreResult, Opportunity } from '../../types/intelligence';
import { DEMO_OPPORTUNITIES } from '../../data/intelligenceDemoData';

/**
 * Reusable function to detect opportunities from business profile and score results
 */
export function detectOpportunities(
  profile: BusinessProfile,
  scoreResult: GrowthScoreResult
): Opportunity[] {
  // If data completeness is extremely low (e.g. user skipped everything), return empty list
  if (scoreResult.dataCompleteness < 20 || profile.skippedFinancials && !profile.businessType) {
    return [];
  }

  // Filter opportunities aligned with business type & maintaining inventory
  let detected = [...DEMO_OPPORTUNITIES];

  if (profile.maintainsInventory === 'No') {
    detected = detected.filter((o) => o.category !== 'Inventory');
  }

  // Prioritize opportunities matching user's specific goals
  if (profile.goals && profile.goals.length > 0) {
    const goalStrings = profile.goals.map((g) => g.toLowerCase());

    detected.sort((a, b) => {
      const aMatch = goalStrings.some((g) => 
        (g.includes('repeat') && a.category === 'Customers') ||
        (g.includes('revenue') && a.category === 'Revenue') ||
        (g.includes('profit') && a.category === 'Profitability') ||
        (g.includes('inventory') && a.category === 'Inventory') ||
        (g.includes('marketing') && a.category === 'Marketing')
      );
      const bMatch = goalStrings.some((g) => 
        (g.includes('repeat') && b.category === 'Customers') ||
        (g.includes('revenue') && b.category === 'Revenue') ||
        (g.includes('profit') && b.category === 'Profitability') ||
        (g.includes('inventory') && b.category === 'Inventory') ||
        (g.includes('marketing') && b.category === 'Marketing')
      );

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;

      // Secondary sort by priority
      const priorityScore = { High: 3, Medium: 2, Low: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority];
    });
  }

  return detected;
}
