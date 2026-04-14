'use client';

import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Vendor } from '@/types';

export default function VendorLeaderboard({ vendors }: { vendors: Vendor[] }) {
  const sorted = [...vendors].sort(
    (a, b) => b.reliability_score - a.reliability_score,
  );

  return (
    <div className="space-y-1">
      {sorted.slice(0, 8).map((vendor, idx) => (
        <div
          key={vendor.vendor_id}
          className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-accent/50 transition-colors"
        >
          <span className="text-xs font-bold text-muted-foreground w-4">
            {idx + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{vendor.name}</p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {vendor.rating}
              <span className="mx-1">&middot;</span>
              {vendor.jobs_completed} jobs
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="outline" className="text-[10px] capitalize">
              {vendor.specialty[0]}
            </Badge>
            <span className="text-[11px] text-emerald-600 font-medium">
              {Math.round(vendor.reliability_score * 100)}% reliable
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
