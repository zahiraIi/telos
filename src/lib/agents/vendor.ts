import type { Vendor, VendorScoreResult } from '@/types';

const WEIGHTS = {
  price: 0.2,
  rating: 0.25,
  response_time: 0.2,
  distance: 0.1,
  specialty: 0.15,
  reliability: 0.1,
};

export function scoreVendor(
  vendor: Vendor,
  category: string,
  allVendors: Vendor[],
): VendorScoreResult {
  const maxPrice = Math.max(...allVendors.map((v) => v.avg_price), 1);
  const maxHours = Math.max(...allVendors.map((v) => v.avg_response_hours), 1);
  const maxDistance = Math.max(...allVendors.map((v) => v.distance_miles), 1);

  const priceNorm = 1 - vendor.avg_price / maxPrice;
  const ratingNorm = vendor.rating / 5.0;
  const responseNorm = 1 - vendor.avg_response_hours / maxHours;
  const distanceNorm = 1 - vendor.distance_miles / maxDistance;

  const specialtyMatch = vendor.specialty.includes(category)
    ? 1.0
    : vendor.specialty.some((s) => isAdjacent(s, category))
      ? 0.5
      : 0.0;

  const reliability =
    vendor.jobs_assigned > 0
      ? vendor.jobs_completed / vendor.jobs_assigned
      : 0;

  const score =
    WEIGHTS.price * priceNorm +
    WEIGHTS.rating * ratingNorm +
    WEIGHTS.response_time * responseNorm +
    WEIGHTS.distance * distanceNorm +
    WEIGHTS.specialty * specialtyMatch +
    WEIGHTS.reliability * reliability;

  return {
    vendor_id: vendor.vendor_id,
    name: vendor.name,
    score: Math.round(score * 100) / 100,
    breakdown: {
      price: Math.round(priceNorm * 100) / 100,
      rating: Math.round(ratingNorm * 100) / 100,
      response_time: Math.round(responseNorm * 100) / 100,
      distance: Math.round(distanceNorm * 100) / 100,
      specialty: specialtyMatch,
      reliability: Math.round(reliability * 100) / 100,
    },
  };
}

export function rankVendors(
  vendors: Vendor[],
  category: string,
): VendorScoreResult[] {
  return vendors
    .map((v) => scoreVendor(v, category, vendors))
    .sort((a, b) => b.score - a.score);
}

function isAdjacent(a: string, b: string): boolean {
  const adjacencyMap: Record<string, string[]> = {
    plumbing: ['hvac', 'general'],
    electrical: ['hvac', 'appliance'],
    hvac: ['plumbing', 'electrical'],
    appliance: ['electrical', 'general'],
    structural: ['general'],
    pest: ['general'],
    general: ['plumbing', 'electrical', 'structural', 'pest', 'appliance'],
  };
  return adjacencyMap[a]?.includes(b) ?? false;
}
